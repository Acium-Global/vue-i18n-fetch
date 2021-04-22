import {
  onMounted, onUnmounted, watch, unref,
} from 'vue-demi';
import type { Composer } from 'vue-i18n';

function buildTDecorator(i18n: Composer) {
  return i18n.t;
}

function buildWatcher(ref, { onChange, queueCleanup }) {
  let unwatch;
  queueCleanup(() => {
    if (unwatch) {
      unwatch();
    }
  });
  return () => {
    if (onChange) {
      unwatch = watch(ref, onChange, {
        immediate: true,
      });
    }
  };
}

function buildMessagesLoader(i18n, fetchMessages) {
  const { locale, setLocaleMessage } = i18n;
  const updateI18N = (messages) => {
    setLocaleMessage(unref(locale), messages);
  };
  return () => fetchMessages(locale)
    .then(updateI18N);
}

function buildMessagesSender(i18n, submitMessages) {
  return () => {
    const msgs = unref(i18n.messages);
    const msgKeys = Object.keys(msgs);
    return Promise.all(msgKeys.map(
      (msgKey) => submitMessages(msgKey, msgs[msgKey]),
    ));
  };
}

export default function withMessagesFetch(i18n: Composer, fetchMessages, submitMessages) {
  const loadMessages = buildMessagesLoader(i18n, fetchMessages);
  const sendMessages = buildMessagesSender(i18n, submitMessages);
  const watchLocale = buildWatcher(i18n.locale, {
    onChange: loadMessages,
    queueCleanup: onUnmounted,
  });
  onMounted(() => {
    watchLocale();
  });

  if (submitMessages) {
    const watchMessages = buildWatcher(i18n.messages, {
      onChange: sendMessages,
      queueCleanup: onUnmounted,
    });
    onMounted(watchMessages);
  }

  return {
    t: buildTDecorator(i18n),
  };
}

import {
  onUnmounted, onMounted, watch, unref,
} from 'vue-demi';
import type { Composer } from 'vue-i18n';

function buildTDecorator(i18n: Composer) {
  return i18n.t;
}

function buildLocaleWatcher(locale, { onChange, queueCleanup }) {
  let unwatchLocale;
  queueCleanup(() => {
    if (unwatchLocale) {
      unwatchLocale();
    }
  });
  return () => {
    if (onChange) {
      unwatchLocale = watch(locale, onChange, {
        immediate: true,
      });
    }
  };
}

function buildMessagesLoader(i18n, { fetchMessages }) {
  const updateI18N = ({ messages }) => {
    i18n.setLocaleMessage(unref(i18n.locale), messages);
  };
  return () => fetchMessages(i18n.locale).then(updateI18N);
}

export default function withMessagesFetch(i18n: Composer, fetchMessages) {
  const isNonDefaultLocale = () => !['en-US', null, undefined].includes(
    unref(i18n.locale),
  );
  const loadMessages = buildMessagesLoader(i18n, {
    fetchMessages,
  });
  const watchLocale = buildLocaleWatcher(i18n.locale, {
    onChange: () => isNonDefaultLocale() && loadMessages(),
    queueCleanup: onUnmounted,
  });

  onMounted(() => {
    watchLocale();
  });

  return {
    t: buildTDecorator(i18n),
  };
}

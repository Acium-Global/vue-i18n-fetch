import { onMounted, onUnmounted, watch, unref, } from 'vue-demi';
function buildTDecorator(i18n) {
    return i18n.t;
}
function buildWatcher(ref, _a) {
    var onChange = _a.onChange, queueCleanup = _a.queueCleanup;
    var unwatch;
    queueCleanup(function () {
        if (unwatch) {
            unwatch();
        }
    });
    return function () {
        if (onChange) {
            unwatch = watch(ref, onChange, {
                immediate: true,
            });
        }
    };
}
function buildMessagesLoader(i18n, fetchMessages) {
    var locale = i18n.locale, setLocaleMessage = i18n.setLocaleMessage;
    var updateI18N = function (messages) {
        setLocaleMessage(unref(locale), messages);
    };
    return function () { return fetchMessages(locale)
        .then(updateI18N); };
}
function buildMessagesSender(i18n, submitMessages) {
    return function () {
        var msgs = unref(i18n.messages);
        var msgKeys = Object.keys(msgs);
        return Promise.all(msgKeys.map(function (msgKey) { return submitMessages(msgKey, msgs[msgKey]); }));
    };
}
export default function withMessagesFetch(i18n, fetchMessages, submitMessages) {
    var loadMessages = buildMessagesLoader(i18n, fetchMessages);
    var sendMessages = buildMessagesSender(i18n, submitMessages);
    var watchLocale = buildWatcher(i18n.locale, {
        onChange: loadMessages,
        queueCleanup: onUnmounted,
    });
    onMounted(function () {
        watchLocale();
    });
    if (submitMessages) {
        var watchMessages = buildWatcher(i18n.messages, {
            onChange: sendMessages,
            queueCleanup: onUnmounted,
        });
        onMounted(watchMessages);
    }
    return {
        t: buildTDecorator(i18n),
    };
}

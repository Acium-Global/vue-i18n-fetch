import { onUnmounted, onMounted, watch, unref, } from 'vue-demi';
function buildTDecorator(i18n) {
    return i18n.t;
}
function buildLocaleWatcher(locale, _a) {
    var onChange = _a.onChange, queueCleanup = _a.queueCleanup;
    var unwatchLocale;
    queueCleanup(function () {
        if (unwatchLocale) {
            unwatchLocale();
        }
    });
    return function () {
        if (onChange) {
            unwatchLocale = watch(locale, onChange, {
                immediate: true,
            });
        }
    };
}
function buildMessagesLoader(i18n, _a) {
    var fetchMessages = _a.fetchMessages;
    var updateI18N = function (_a) {
        var messages = _a.messages;
        i18n.setLocaleMessage(unref(i18n.locale), messages);
    };
    return function () { return fetchMessages(i18n.locale).then(updateI18N); };
}
export default function withMessagesFetch(i18n, fetchMessages) {
    var isNonDefaultLocale = function () { return !['en-US', null, undefined].includes(unref(i18n.locale)); };
    var loadMessages = buildMessagesLoader(i18n, {
        fetchMessages: fetchMessages,
    });
    var watchLocale = buildLocaleWatcher(i18n.locale, {
        onChange: function () { return isNonDefaultLocale() && loadMessages(); },
        queueCleanup: onUnmounted,
    });
    onMounted(function () {
        watchLocale();
    });
    return {
        t: buildTDecorator(i18n),
    };
}

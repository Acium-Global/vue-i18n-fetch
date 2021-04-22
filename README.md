# vue-i18n-fetch

Async store and load vue-i18n messages

## Requeriments

Currently this package is only compatible with [Vue I18n v9](https://vue-i18n.intlify.dev)

## Installation

**NPM**

```bash
npm install --save klarkc/vue-i18n-fetch
```

**Yarn**

```bash
yarn add klarkc/vue-i18n-fetch
```

**PNPM**

```bash
pnpm add klarkc/vue-i18n-fetch
```

## Usage

### Loading messages asynchronously

Just decorates i18n with changed behavior.

```html
<template>
  <div>
    <button @click="setLocale()">
        Load standard (english)
    </button>
    <button @click="setLocale('pt-br')">
        Load portuguese
    </button>

    <h1>
        {{ t('title') }}
    </h1>

    <p>
        {{ t('lorem') }}
    </p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import withMessagesFetch from 'vue-i18n-fetch';

const fetchMessages = (locale) => Promise.resolve({
  title: 'Server gathered title',
  lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
})

const i18n = useI18n();
const { t } = withMessagesFetch(i18n, fetchMessages);
const setLocale = (locale) => {
  i18n.locale.value = locale;
};
</script>
```

### Storing messages asynchronously

You can submit default messages to somewhere, this way CI/CD pipelines can extract added/updated messages.

```html
<!-- App.vue -->
<template>
  <div>{{ t('title') }}</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import withMessagesFetch from 'vue-i18n-fetch';
import fetch from 'cross-fetch';

const i18n = useI18n({
  locale: en,
  messages: {
    en: {
      default: 'My Title'
    }
  }
})

/* ... */

/*
  submitMessages is called for every
  locale defined in useI18N 
*/
const submitMessages = (locale, messages) => {
  if(typeof window === 'undefined') {
    /* submit locale messages */
  }
};

const { t } = withMessagesFetch(
  i18n,
  fetchMessages,
  windowsubmitMessages,
);
const setLocale = (locale) => {
  i18n.locale.value = locale;
};
</script>
```

Then render the server side application, [more info](https://v3.vuejs.org/guide/ssr).

```js
/* main.js */
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import App from './App.vue';

const app = createSSRApp(App)

const appContent = await renderToString(app)
```
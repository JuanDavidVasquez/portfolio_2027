<template>
  <section id="contacto" class="contact">
    <div class="contact__inner">
      <div class="section-eyebrow">{{ t('contact.eyebrow') }}</div>
      <h2 class="section-title">{{ t('contact.title') }}</h2>

      <div class="contact__grid">
        <!-- Left: info -->
        <div class="contact__info">
          <p class="contact__lead">{{ t('contact.lead') }}</p>

          <div class="contact__lines">
            <div class="contact-line">
              <span class="contact-line__key">email</span>
              <span class="contact-line__val">ingjuandavid@hotmail.com</span>
            </div>
            <div class="contact-line">
              <span class="contact-line__key">github</span>
              <span class="contact-line__val">github.com/JuanDavidVasquez</span>
            </div>
            <div class="contact-line">
              <span class="contact-line__key">linkedin</span>
              <span class="contact-line__val">linkedin.com/in/juan-david-vasquez-73778126</span>
            </div>
            <div class="contact-line">
              <span class="contact-line__key">ubi</span>
              <span class="contact-line__val">{{ t('contact.location') }}</span>
            </div>
          </div>
        </div>

        <!-- Right: form -->
        <form class="contact__form" novalidate @submit.prevent="onSubmit">
          <!-- Name -->
          <div class="field" :class="{ 'field--error': errors.name, 'field--filled': form.name }">
            <input
              id="f-name"
              v-model="form.name"
              type="text"
              placeholder=" "
              class="field__input"
              @blur="validateField('name')"
            />
            <label for="f-name" class="field__label">{{ t('contact.name') }}</label>
            <span v-if="errors.name" class="field__error">{{ errors.name }}</span>
          </div>

          <!-- Email -->
          <div class="field" :class="{ 'field--error': errors.email, 'field--filled': form.email }">
            <input
              id="f-email"
              v-model="form.email"
              type="email"
              placeholder=" "
              class="field__input"
              @blur="validateField('email')"
            />
            <label for="f-email" class="field__label">{{ t('contact.email') }}</label>
            <span v-if="errors.email" class="field__error">{{ errors.email }}</span>
          </div>

          <!-- Message -->
          <div class="field field--textarea" :class="{ 'field--error': errors.message, 'field--filled': form.message }">
            <textarea
              id="f-msg"
              v-model="form.message"
              placeholder=" "
              class="field__input field__textarea"
              rows="5"
              @blur="validateField('message')"
            />
            <label for="f-msg" class="field__label">{{ t('contact.message') }}</label>
            <span v-if="errors.message" class="field__error">{{ errors.message }}</span>
          </div>

          <div class="contact__form-footer">
            <Transition name="fade">
              <span v-if="sent" class="contact__sent">✓ {{ t('contact.sent') }}</span>
            </Transition>
            <button type="submit" class="btn btn--primary">{{ t('contact.submit') }} →</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLocale()

const form    = reactive({ name: '', email: '', message: '' })
const errors  = reactive<Record<string, string>>({})
const sent    = ref(false)

function validateField(field: 'name' | 'email' | 'message') {
  if (field === 'name') {
    errors.name = form.name.trim() ? '' : t('contact.err.name')
  }
  if (field === 'email') {
    errors.email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) ? '' : t('contact.err.email')
  }
  if (field === 'message') {
    errors.message = form.message.trim().length >= 10 ? '' : t('contact.err.message')
  }
}

function onSubmit() {
  validateField('name'); validateField('email'); validateField('message')
  if (errors.name || errors.email || errors.message) return
  sent.value = true
  setTimeout(() => {
    sent.value = false
    form.name = ''; form.email = ''; form.message = ''
    Object.keys(errors).forEach(k => delete (errors as Record<string, string>)[k])
  }, 2500)
}
</script>

<style scoped>
.contact {
  padding: 120px 40px;
  background: var(--grad-surface);
}
.contact__inner {
  max-width: var(--container-max);
  margin: 0 auto;
}
.section-eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-primary);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.section-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: var(--color-heading);
  margin: 0 0 48px 0;
  letter-spacing: -0.02em;
}

.contact__grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 64px;
}
@media (max-width: 768px) {
  .contact__grid { grid-template-columns: 1fr; gap: 40px; }
}

.contact__lead {
  font-size: 17px;
  line-height: 1.6;
  color: var(--color-text);
  margin: 0 0 32px 0;
}
.contact__lines { display: flex; flex-direction: column; }
.contact-line {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}
.contact-line__key {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  width: 72px;
  text-transform: lowercase;
  flex-shrink: 0;
}
.contact-line__val {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-heading);
  word-break: break-all;
}

/* Form */
.contact__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* FloatLabel field */
.field {
  position: relative;
}
.field__input {
  width: 100%;
  box-sizing: border-box;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 22px 14px 8px;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 14px;
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease;
  line-height: 1.5;
}
.field__textarea {
  min-height: 110px;
  resize: vertical;
  padding-top: 24px;
}
.field__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59,130,246,.15);
}
.field--error .field__input {
  border-color: var(--color-danger);
}
.field--error .field__input:focus {
  box-shadow: 0 0 0 3px rgba(239,68,68,.15);
}

/* Float label */
.field__label {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--color-muted);
  pointer-events: none;
  transition: top .2s ease, font-size .2s ease, color .2s ease, background .2s ease;
  padding: 0 2px;
}
/* textarea: label starts near top */
.field--textarea .field__label {
  top: 20px;
  transform: none;
}

/* Float up when focused or filled */
.field__input:focus + .field__label,
.field__input:not(:placeholder-shown) + .field__label,
.field--filled .field__label {
  top: 6px;
  transform: none;
  font-size: 10px;
  color: var(--color-primary);
  background: var(--color-surface);
}
.field--textarea .field__input:focus + .field__label,
.field--textarea .field__input:not(:placeholder-shown) + .field__label {
  top: 6px;
}
.field--error .field__input:focus + .field__label,
.field--error .field__input:not(:placeholder-shown) + .field__label {
  color: var(--color-danger);
}

.field__error {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-danger);
  margin-top: 4px;
  display: block;
}

.contact__form-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
}
.contact__sent {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-success);
}

/* Button */
.btn {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  padding: 0.65rem 1.25rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all .3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn--primary {
  background: var(--color-primary);
  color: #fff;
}
.btn--primary:hover {
  background: var(--color-accent);
  transform: translateY(-1px);
  box-shadow: 0 0 16px rgba(59,130,246,.35);
}

/* Transition */
.fade-enter-active, .fade-leave-active { transition: opacity .3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

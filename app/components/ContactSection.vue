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
            <span v-if="errors.name" class="field__err">{{ errors.name }}</span>
          </div>

          <!-- Email (leading @ icon) -->
          <div class="field field--icon" :class="{ 'field--error': errors.email, 'field--filled': form.email }">
            <input
              id="f-email"
              v-model="form.email"
              type="email"
              placeholder=" "
              class="field__input"
              @blur="validateField('email')"
            />
            <span class="field__icon">@</span>
            <label for="f-email" class="field__label">{{ t('contact.email') }}</label>
            <span v-if="errors.email" class="field__err">{{ errors.email }}</span>
          </div>

          <!-- Message -->
          <div class="field field--textarea" :class="{ 'field--error': errors.message, 'field--filled': form.message }">
            <textarea
              id="f-msg"
              v-model="form.message"
              placeholder=" "
              class="field__input"
              rows="4"
              @blur="validateField('message')"
            />
            <label for="f-msg" class="field__label">{{ t('contact.message') }}</label>
            <span v-if="errors.message" class="field__err">{{ errors.message }}</span>
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

/* ===== Form ===== */
.contact__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* FloatLabel — variant="on": label floats ONTO the top border */
.field {
  position: relative;
}

.field__input {
  display: block;
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.2;
  color: var(--color-heading);
  background: #0B1220;
  border: 1px solid #334155;
  border-radius: 8px;
  height: 48px;
  padding: 0 14px;
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
}
.field__input::placeholder { color: transparent; }

/* Label — rest: vertically centered inside the field */
.field__label {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1;
  color: var(--color-muted);
  padding: 0 6px;
  background: transparent;
  pointer-events: none;
  white-space: nowrap;
  transition: top .2s ease, left .2s ease, font-size .2s ease,
              color .2s ease, background-color .2s ease, letter-spacing .2s ease;
}

/* Floated — label sits ON the border line (center at top: 0) */
.field:focus-within .field__label,
.field--filled .field__label {
  top: 0;
  font-size: 11px;
  color: var(--color-primary);
  background: var(--color-bg);
  font-family: var(--font-mono);
  letter-spacing: .5px;
}

/* Focus ring */
.field__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59,130,246,.18);
  background: #0F172A;
}

/* Error state */
.field--error .field__input { border-color: var(--color-danger); }
.field--error .field__input:focus { box-shadow: 0 0 0 3px rgba(239,68,68,.18); }
.field--error:focus-within .field__label,
.field--error.field--filled .field__label { color: var(--color-danger); }

/* Error message — with ! circle prefix */
.field__err {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-danger);
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.field__err::before {
  content: '!';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-danger);
  color: #fff;
  font-weight: 700;
  font-size: 10px;
  flex: none;
}

/* Leading icon (email @ symbol) */
.field--icon .field__input { padding-left: 42px; }
.field__icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--color-muted);
  pointer-events: none;
  transition: color .2s ease;
  z-index: 1;
}
.field--icon:focus-within .field__icon { color: var(--color-primary); }
/* label rests after the icon */
.field--icon .field__label { left: 36px; }
/* label moves back left when floated */
.field--icon:focus-within .field__label,
.field--icon.field--filled .field__label { left: 10px; }

/* Textarea */
.field--textarea .field__input {
  height: auto;
  min-height: 88px;
  resize: none;
  padding: 14px;
  line-height: 1.45;
}
.field--textarea .field__label {
  top: 14px;
  transform: none;
}
.field--textarea:focus-within .field__label,
.field--textarea.field--filled .field__label {
  top: 0;
  transform: none;
}

/* Form footer */
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

/* Submit button */
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

@media (max-width: 640px) {
  .contact { padding: 80px 20px; }
}
</style>

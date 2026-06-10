<template>
  <div class="skeleton-card">
    <div class="sk-header">
      <div class="sk-bar sk-title"></div>
      <div class="sk-bar sk-price"></div>
    </div>
    <div class="sk-body">
      <div class="sk-bar sk-line w80"></div>
      <div class="sk-bar sk-line w60"></div>
      <div class="sk-bar sk-line w70"></div>
    </div>
    <div class="sk-footer">
      <div class="sk-bar sk-tag"></div>
      <div class="sk-bar sk-tag"></div>
      <div class="sk-bar sk-btn"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.sk-bar {
  border-radius: var(--radius-full);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.13) 50%,
    rgba(255, 255, 255, 0.06) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease infinite;
}

@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}

.sk-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sk-title { height: 18px; width: 55%; }
.sk-price { height: 22px; width: 22%; }

.sk-body { display: flex; flex-direction: column; gap: 9px; }
.sk-line  { height: 12px; }
.w80 { width: 80%; }
.w60 { width: 60%; }
.w70 { width: 70%; }

.sk-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.sk-tag { height: 24px; width: 56px; }
.sk-btn { height: 36px; flex: 1; margin-left: auto; border-radius: var(--radius-md); }
</style>

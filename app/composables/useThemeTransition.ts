/**
 * 테마 클래스(.dark, .sakura, .rain) 토글 시 transition을 잠시 비활성화한다.
 * background-color transition이 걸린 요소들이 0.15s 지연되어 색이 바뀌는 현상을 막기 위함.
 */
export function withoutThemeTransition(mutate: () => void) {
  if (typeof document === 'undefined') {
    mutate()
    return
  }
  const html = document.documentElement
  html.classList.add('no-theme-transition')
  mutate()
  // 두 번의 RAF로 클래스 변경에 따른 reflow가 적용된 다음 frame에 transition을 다시 켠다.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      html.classList.remove('no-theme-transition')
    })
  })
}

// 사이트 작성자(블로그 owner) 정보. 모든 피드 카드에서 공유된다.
// 이름·이니셜·이미지 경로를 여기서 한 번에 관리한다.
export const SITE_AUTHOR = {
  name: 'freak',
  initial: '🐳',
  // 비어 있으면 이니셜 아바타로 렌더링. '/images/profile.png' 같은 경로를 채우면
  // resolveImageSrc() 가 /freak basePath 를 자동 prefix 한 <img> 로 전환된다.
  imagePath: '/images/profile.jpg',
}

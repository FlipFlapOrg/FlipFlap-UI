export const serviceIcon = (serviceName: string) => {
  switch (serviceName) {
    case 'Amazon':
      return '/service/Amazon-logo-RGB.png'
    case 'コミックウォーカー':
      return '/service/logo_comicwalker.svg'
    case 'コミックシーモア':
      return '/service/si-moa.png'
    case 'pixivコミック':
      return '/service/pixiv-comic.svg'
    default:
      return 'flipflap.png'
  }
}

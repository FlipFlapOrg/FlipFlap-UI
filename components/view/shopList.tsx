import ShopListItem from './shopListItem'
import { Shop } from 'lib/mangaData'

interface Props {
  shops: Shop[]
}

const ShopList = (props: Props) => {
  return (
    <div>
      {props.shops.map((shop, idx) => (
        <ShopListItem key={idx} shopName={shop.name} href={shop.url} />
      ))}
    </div>
  )
}

export default ShopList

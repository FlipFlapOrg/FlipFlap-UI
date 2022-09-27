import ShopListItem from './shopListItem'
import { Shop } from 'api/parser/manga'
import { serviceIcon } from 'lib/serviceIcon'

interface Props {
  shops: Shop[]
}

const ShopList = (props: Props) => {
  return (
    <div>
      {props.shops.map((shop, idx) => {
        const icon = serviceIcon(shop.service_name)
        return (
          <ShopListItem
            key={idx}
            shopName={shop.service_name}
            href={shop.url}
            icon={icon}
          />
        )
      })}
    </div>
  )
}

export default ShopList

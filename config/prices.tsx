import {PriceInfo} from '@/components/price';
import {PiFireDuotone} from "react-icons/pi";

export const priceFree: PriceInfo = {
    name: "免费",
    singleFile: "50 MB",
    allSpace: "2 GB",
    storageTime: "30 天",
    price: 0,
}

export const priceStarted: PriceInfo = {
    name: "入门",
    singleFile: "50 MB",
    allSpace: "10 GB",
    storageTime: "120 天",
    price: 30, // 0.9 320
}

export const priceAdvanced: PriceInfo = {
    name: <div className="flex space-x-2 items-center">
        <span>进阶</span>
        <PiFireDuotone style={{color: "red"}}/>
    </div>,
    singleFile: "100 MB",
    allSpace: "50 GB",
    storageTime: "180 天",
    price: 50, // 0.8 480
}

export const priceProfessional: PriceInfo = {
    name: "专业",
    singleFile: "不限",
    allSpace: "200 GB",
    storageTime: "365 天",
    price: 150, // 0.7 1250
}

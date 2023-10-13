import { Dimensions, PixelRatio } from 'react-native'

const DataUtil = {
    ratio: PixelRatio.get(),
    pixel: 1 / PixelRatio.get(),
    size: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height
    }
}

export default DataUtil;
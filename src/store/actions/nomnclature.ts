import axios from "axios"
import { Dispatch } from "redux"
import { NomenclatureAction, NomenclatureActionTypes } from "../../types/types"

const token = 'e22db6c6-89d7-4ff4-80ea-ab1b32a279b9'

const headers = {
    'Authorization': `Token ${token}`,
  }

export const GetNomenclature = (curPage?: number, perPage?: number) => {
    return async (dispatch: Dispatch<NomenclatureAction>) => {
        try {
            dispatch({type: NomenclatureActionTypes.GET_NOMENCLATURE_REQUEST})
            const res = await axios.get(
                `https://cnr.bast-dev.ru/api/v2/internal/nomenclature?curPage=${curPage}&perPage=${perPage}`, 
                {
                    headers: headers,
                }
            )
            dispatch({type: NomenclatureActionTypes.GET_NOMENCLATURE_SUCCESS, payload: res.data})
        } catch (e) {
            dispatch({
                type: NomenclatureActionTypes.GET_NOMENCLATURE_ERROR, 
                payload: 'Error'})
        }
    }
}
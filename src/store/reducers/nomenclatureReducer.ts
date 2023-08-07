import { NomenclatureAction, NomenclatureActionTypes, NomenclatureState } from '../../types/types'

const initialState: NomenclatureState = {
    nomenclature: {
        count: 0,
        data: [],
    },
    loading: false,
    error: null,
}

export const nomenclatureReducer = (state = initialState, action: NomenclatureAction): NomenclatureState => {
    switch (action.type) {
        case NomenclatureActionTypes.GET_NOMENCLATURE_REQUEST:
            return {
                nomenclature:  {
                    count: 0,
                    data: [],
                },
                loading: true,
                error: null,
            }
        case NomenclatureActionTypes.GET_NOMENCLATURE_SUCCESS:
            return {
                nomenclature: action.payload,
                loading: false,
                error: null,
            }
        case NomenclatureActionTypes.GET_NOMENCLATURE_ERROR:
            return {
                nomenclature:  {
                    count: 0,
                    data: [],
                },
                loading: false,
                error: action.payload,
        }
        default:
            return state
    }
}
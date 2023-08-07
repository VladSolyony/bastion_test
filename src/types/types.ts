export enum NomenclatureActionTypes {
    GET_NOMENCLATURE_REQUEST = 'GET_NOMENCLATURE_REQUEST',
    GET_NOMENCLATURE_SUCCESS = 'GET_NOMENCLATURE_SUCCESS',
    GET_NOMENCLATURE_ERROR = 'GET_NOMENCLATURE_ERROR',
}

export interface NomenclatureState {
    nomenclature: {
        count: number,
        data: any[],
    };
    loading: boolean;
    error: null | string;
}

interface FetchNomenclatureRequestAction {
    type: NomenclatureActionTypes.GET_NOMENCLATURE_REQUEST;
}

interface FetchNomenclatureSuccessAction {
    type: NomenclatureActionTypes.GET_NOMENCLATURE_SUCCESS;
    payload: NomenclaturePayload,
}

interface FetchNomenclatureErrorAction {
    type: NomenclatureActionTypes.GET_NOMENCLATURE_ERROR;
    payload: string,
}

export type NomenclatureAction = FetchNomenclatureRequestAction | FetchNomenclatureSuccessAction | FetchNomenclatureErrorAction

export interface Nomenclature {
    id: string,
    name: string,
    fullName: string,
    barcode: string,
    name1c: string,
    sku: string,
    status: string,
}

type NomenclaturePayload = {
    count: number,
    data: Nomenclature[],
}

export type Header = {
    key: string, 
    label: string,
}
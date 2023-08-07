import { combineReducers } from 'redux'
import { nomenclatureReducer } from './nomenclatureReducer'

export const rootReducer = combineReducers({
    nomenclature: nomenclatureReducer,
})

export type RootState = ReturnType<typeof rootReducer>
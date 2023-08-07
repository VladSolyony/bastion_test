import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector'
import { useDispatch } from 'react-redux';
import { GetNomenclature } from '../store/actions/nomnclature';
import {VscTriangleLeft, VscTriangleRight} from 'react-icons/vsc'
import {BiSearch} from 'react-icons/bi'
import {BiSolidDownArrow, BiSolidUpArrow} from 'react-icons/bi'
import { debounce } from 'lodash'
import { Nomenclature, Header } from '../types/types';
import './style.css'

const NomenclatureList: FC = () => {
    const { nomenclature, loading, error } = useTypedSelector(state => state.nomenclature)
    const dispatch = useDispatch<any>()
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsQuantity, setItemsQuantity] = useState(50)
    const [totalQuantity, setTotalQuantity] = useState(0)
    const [isOpen, setOpen] = useState(false)
    const [sortableList, setSortableList] = useState<Nomenclature[] | []>([])
    const [clicks, setClicks] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [sortedColumn, setSortedColumn] = useState('')

    const headers = [
        { key: 'name', label: 'Имя'},
        { key: 'fullName', label: 'Полное имя'},
        { key: "barcode", label: 'Штрих-код'},
        { key: "name1c", label: 'Наименование в 1С'},
        { key: 'sku', label: "СКУ"},
        { key: 'status', label: "Статус"},
    ]

    useEffect(() => {
        if (nomenclature?.data?.length < 1) return;
        setTotalQuantity(nomenclature?.count)
        setSortableList([...nomenclature?.data])
    }, [nomenclature]);
    
    useEffect(() => {
        dispatch(GetNomenclature(currentPage, itemsQuantity))
    }, [itemsQuantity]);

    const handleFlipPage = (direction: string): void => {
        switch (direction) {
            case 'forward':
                if (Math.ceil(totalQuantity / itemsQuantity) <= currentPage) return;
                dispatch(GetNomenclature(currentPage + 1, itemsQuantity))
                setCurrentPage(currentPage + 1)
                break
            case 'back':
                if (currentPage === 1) return;
                dispatch(GetNomenclature(currentPage - 1, itemsQuantity))
                setCurrentPage(currentPage - 1)
                break
            default:
                break
        }
    }

    const handleInputChange = useCallback(
        debounce((currentPage) => {
            dispatch(GetNomenclature(currentPage === '' || currentPage === 0 ? 1 : currentPage, itemsQuantity))
            if (currentPage === '' || currentPage <= 0) {
                setCurrentPage(1)
            }
        }, 750),
        []
      );

    const handleChangePage = (e: React.FormEvent<HTMLInputElement>): void => {
        if (!!e.currentTarget.value.match(/[^0-9]/g)) return;
        if (Math.ceil(totalQuantity / itemsQuantity) < +e.currentTarget.value) {
            return;
        }
        setCurrentPage(+e.currentTarget.value)
        handleInputChange(+e.currentTarget.value);
      }

    const handleChangeQuantity = (quantity: number): void => {
        if (Math.ceil(totalQuantity / quantity) < currentPage) return;
        setItemsQuantity(quantity)
        setOpen(false)
    }

    const byField = <T extends Nomenclature>(field: keyof T)  => {
        return (a: T, b: T) => a[field] > b[field] ? 1 : -1 
    }

    const handleSortByField = (field: keyof Nomenclature): void => {
        switch (clicks) {
            case 0:
                setSortableList(sortableList.sort(byField<Nomenclature>(field)))
                setClicks(clicks + 1)
                setSortedColumn(field)
                break
            case 1:
                setSortableList(sortableList.reverse())
                setClicks(clicks + 1)
                setSortedColumn(field)
                break
            case 2:
                setSortableList([...nomenclature?.data])
                setClicks(0)
                setSortedColumn('')
                break   
            default:
                break
        }
    }

    const handleChangeSearchValue = (e: React.FormEvent<HTMLInputElement>): void => {
        setSearchValue(e.currentTarget.value)
    }

    const handleSearch = (): void => {
        if (searchValue === '') {
            setSortableList([...nomenclature?.data])
            setClicks(clicks + 0)
            return;
        }
        setSortableList([...sortableList].filter((item: Nomenclature) => {
            return item.name?.toLowerCase().includes(searchValue.toLowerCase())
                || item.fullName?.toLowerCase().includes(searchValue.toLowerCase())
                || item.barcode?.toLowerCase().includes(searchValue.toLowerCase())
                || item.name1c?.toLowerCase().includes(searchValue.toLowerCase())
                || item.sku?.toString().toLowerCase().includes(searchValue.toLowerCase())
                || item.status?.toLowerCase().includes(searchValue.toLowerCase())
            })
        )
    }

    return (
        <div>
            <div className='dropdown__header'>
                <div className='dropdown_wrapper'>
                    <h2>Кол-во строк:</h2>
                    <div className="dropdown">
                        <button className='dropdown__button' onClick={(): void => setOpen(!isOpen)}>
                            {itemsQuantity}
                        </button>
                            {isOpen ? (
                                <ul className="menu" onBlur={(): void => setOpen(false)}>
                                    <li className="menu-item">
                                        <button onClick={(): void => handleChangeQuantity(25)}>25</button>
                                    </li>
                                    <li className="menu-item">
                                        <button onClick={(): void => handleChangeQuantity(50)}>50</button>
                                    </li>
                                    <li className="menu-item">
                                        <button onClick={(): void => handleChangeQuantity(75)}>75</button>
                                    </li>
                                    <li className="menu-item">
                                        <button onClick={(): void => handleChangeQuantity(100)}>100</button>
                                    </li>
                                </ul>
                            ) : null}
                    </div>
                </div>
                <div className='dropdown__input-wrapper'>
                    <input className='input-wrapper__input' type="text" onChange={(e: React.FormEvent<HTMLInputElement>): void => handleChangeSearchValue(e)} />
                    <button disabled={loading} className='input-wrapper__button' onClick={(): void => handleSearch()}>
                        <BiSearch />
                    </button>
                </div>
            </div>
            <table key={clicks}>
                <thead>
                    <tr>
                        {headers.map((row: Header) => {
                            return (
                                <td key={row.key} onClick={(): void => handleSortByField(row.key as keyof Nomenclature)} className='nomenclature__table-header'>
                                   <div className='table-header__row'>
                                        <div>
                                            {row.label}
                                        </div>
                                        {(clicks !== 0 && row.key === sortedColumn) && 
                                            <div>
                                                {
                                                    clicks === 1 ? <BiSolidUpArrow /> : <BiSolidDownArrow />
                                                
                                                }
                                            </div>
                                        }
                                   </div>
                                </td>
                                    )
                                }
                            )    
                        }
                    </tr>
                </thead>
                {!loading && <tbody>
                    {sortableList?.map((item: Nomenclature) => {
                        return (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.fullName}</td>
                                <td>{item.barcode}</td>
                                <td>{item.name1c}</td>
                                <td>{item.sku}</td>
                                <td>{item.status}</td>
                            </tr>
                            )
                    }) 
                    }
                </tbody>
                }            
            </table>
            {loading &&
                    <div className="nomenclature__loader-wrapper">
                        <h1>Загрузка...</h1>
                    </div>
            }
            {
                error && 
                    <div className="nomenclature__loader-wrapper">
                        <h1>Упс, что-то пошло не так...</h1>
                    </div>
            }   
            <div className='nomenclature__pagination-container'>
                <button
                    disabled={loading || sortableList.length === 0}
                    className={currentPage === 1 ? 'pagination-container__button-disabled' : 'pagination-container__button'}
                    onClick={(): void => handleFlipPage('back')}
                >
                    <VscTriangleLeft />
                </button>
                <input className='pagination-container__input' type="text" value={currentPage} onChange={(e): void => handleChangePage(e)} />
                <button 
                    disabled={loading || sortableList.length === 0}
                    className={Math.ceil(totalQuantity / itemsQuantity) <= currentPage ? 'pagination-container__button-disabled' :'pagination-container__button'}
                    onClick={(): void => handleFlipPage('forward')}
                >
                    <VscTriangleRight />
                </button>
            </div>
        </div>
    )
}

export default NomenclatureList
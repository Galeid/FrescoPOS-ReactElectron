import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../../services/AuthContext';
import { useHistory } from 'react-router-dom'
//import { ipcRenderer as ipc } from 'electron'

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AlertSmall from '../../components/Alert/AlertSmall'
import AlertBig from '../../components/Alert/AlertBig'
import { Delete, Edit, Add } from '@material-ui/icons';
import {
    Button,
    Box,
    Chip,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    SvgIcon,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from '@material-ui/core';
import Search from '@material-ui/icons/Search';

const { ipcRenderer } = window.require('electron')
interface Product {
    idProduct: string,
    nameCategory: string,
    barcodeProduct: string,
    nameProduct: string,
    stockProduct: string,
    priceSellProduct: string,
    priceBuyProduct: string,
    descriptionProduct: string,
    stateProduct: string
}
let productsFromDB: Product[] = []

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        margin: '10px',
    },
    container: {
        paddingTop: '40px',
        alignItems: 'center'
    },
    containerTabla: {
        margin: '10px',
        alignItems: 'center'
    },
    nomargin: {
        margin: 0
    },
    rootbutton: {
       minWidth: 'auto',
       padding: '6px 8px 6px 8px'
    }
}));

const ProductList = () => {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [show, showProducts] = useState(false)
    const [input, setInput] = useState('')
    const [productDB, setProductDB] = useState(productsFromDB)
    const { user } = useContext(AuthContext)
    let history = useHistory()
    const [alert , setAlert] = useState(0);

    const getProducts = () => {
        const prepareData = {
            spName: 'spListProducts'
        }
        ipcRenderer.invoke('getproducts', prepareData)
            .then((products: any) => {
                setProductDB(products)
                showProducts(true)
            })
    }

    const deleteProduct = (id: string) => {
        AlertBig('Estas seguro de eliminar el producto?', 'Esta accion no se puede revertir!', 'warning', 'Si, deseo eliminarlo!').then((result: any) => {
            if (result.isConfirmed) {
                const prepareData = {
                    Entry: {
                        value: id
                    },
                    spName: 'spDeleteProduct'
                }
                ipcRenderer.invoke('deleteproduct', prepareData)
                    .then(() => {
                        AlertSmall('info', 'Se elimino correctamente')
                        getProducts()
                        setPage(0)
                    })
            }
        })
    }

    const handleChange = (e: any) => {
        setInput(e.target.value)
    }

    const handleChangePage = (e : any, newPage : number) => {
        console.log("page:" ,newPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e : any) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    //Cambiar que solo se renderiza una vez
    useEffect(() => {
        const getSearchProduct = () => {
            const prepareData = {
                Entry: {
                    value: input
                },
                spName: 'spSearchProducts'
            }
            ipcRenderer.invoke('searchproducts', prepareData)
                .then((products: any) => {
                    setProductDB(products)
                    if (productsFromDB.length > 0) {
                        console.log("1. productsFromDB: ", productsFromDB)
                        showProducts(true)
                    }
                })
        }
        //console.log(productDB)
        //console.log(user)
        if (input.length > 2) {
            getSearchProduct()
            setPage(0);
            setAlert(1)
        } else {
            getProducts()
            setAlert(0)
        }
    }, [input])

    return show ? (
        <>
            <Card className={classes.root}>
                <Box flexDirection="row-reverse">
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h2" style={{ marginBottom: '8px' }}>Lista de Productos:</Typography >
                            <TextField
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" style={{ padding: '0px 0px' }}>
                                            <SvgIcon
                                                fontSize="small"
                                                color="action"
                                            >
                                                <Search />
                                            </SvgIcon>
                                        </InputAdornment>
                                    )
                                }}
                                inputProps={{
                                    style: { padding: '12px 0px' }
                                }}
                                placeholder="Buscar productos"
                                variant="outlined"
                                helperText={alert ? "" : "Ingresa un minimo de 3 letras para comenzar la busqueda"}
                                onChange={handleChange}
                                value={input}
                            />

                            {
                                (user != null) ?
                                    (user.idRole === 1) ?
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ marginTop: '10px' }}
                                            startIcon={<Add />}
                                            onClick={() => {
                                                history.push(`/productsDetails/${null}`)
                                            }}
                                        >
                                            Agregar
                                        </Button>
                                        :
                                        false
                                    :
                                    false
                            }
                        </CardContent>
                    </Card>
                </Box>
            </Card>
            <Card className={classes.root}>
                <Grid item xs={12} className={classes.containerTabla}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Codigo de Barras</TableCell>
                                    <TableCell align="center">Nombre</TableCell>
                                    <TableCell align="center">Categoria</TableCell>
                                    <TableCell align="center">Stock</TableCell>
                                    <TableCell align="center">Precio Venta</TableCell>
                                    <TableCell align="center">Precio Compra</TableCell>
                                    <TableCell align="center">Notas</TableCell>
                                    <TableCell align="center">Estado</TableCell>
                                    {
                                        (user != null) ?
                                            (user.idRole === 1) ?
                                                <TableCell align="center">Detalles</TableCell>
                                                :
                                                false
                                            :
                                            false
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productDB
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((p, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{p.barcodeProduct}</TableCell>
                                        <TableCell align="center">{p.nameProduct}</TableCell>
                                        <TableCell align="center">{p.nameCategory}</TableCell>
                                        <TableCell align="center">{p.stockProduct}</TableCell>
                                        <TableCell align="center">{p.priceSellProduct}</TableCell>
                                        <TableCell align="center">{p.priceBuyProduct}</TableCell>
                                        <TableCell align="center">{p.descriptionProduct ?
                                            p.descriptionProduct
                                            :
                                            'No hay notas'
                                            }
                                        </TableCell>
                                        <TableCell align="center">{p.stateProduct ?
                                            <Chip
                                                color="primary"
                                                label="Activo"
                                                size="small"
                                            /> :
                                            <Chip
                                                color="secondary"
                                                label="Inactivo"
                                                size="small"
                                            />}
                                        </TableCell>
                                        {
                                            (user != null) ?
                                                (user.idRole === 1 || user.idRole === 3 ) ?
                                                    <TableCell align="center">
                                                        <Grid container spacing={2}>
                                                            <Grid
                                                                item
                                                                xs={6} //12
                                                            >
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    startIcon={<Edit />}
                                                                    classes={{
                                                                        startIcon: classes.nomargin,
                                                                        root: classes.rootbutton
                                                                     }}
                                                                    onClick={() => {
                                                                        history.push(`/productsDetails/${p.idProduct}`)
                                                                    }}
                                                                />
                                                            </Grid>
                                                            {(user.idRole === 1) ?
                                                            <Grid
                                                                item
                                                                xs={6} //12
                                                            >
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    onClick={() => deleteProduct(p.idProduct)}
                                                                    classes={{
                                                                        startIcon: classes.nomargin,
                                                                        root: classes.rootbutton
                                                                    }}
                                                                    startIcon={<Delete />}
                                                                />
                                                            </Grid>
                                                            :
                                                            false
                                                            }
                                                        </Grid>
                                                    </TableCell>
                                                    :
                                                    false
                                                :
                                                false
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={productDB.length}
                        //count={productDB.length === -1 ? 1 * 10 + 1 : productDB.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        //page={( page > 0 && productDB.length === rowsPerPage ) ? 0 : page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Grid>
            </Card>
        </>
    ) : (<></>)
}

export default ProductList
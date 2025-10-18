'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

import CustomTextField from '../../@core/components/mui/TextField'
import DialogCloseButton from '../dialogs/DialogCloseButton'

import type { PersonType, ProductType } from '@/types'
import { useProductList, useCartCreate, useBulkCartProductCreate } from '../../services/persons'
import { ORGANIZATION_KEY } from '../../utils/organization'

type TableBindingDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  person: PersonType
  onSuccess?: (orderData: { tableNumber: number; products: ProductType[] }) => void
}

const TableBindingDialog = ({ open, setOpen, person, onSuccess }: TableBindingDialogProps) => {
  const [activeStep, setActiveStep] = useState(0)
  const [tableNumber, setTableNumber] = useState<number | ''>('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [createdCartId, setCreatedCartId] = useState<string | null>(null)

  const { data: productsData, loading: productsLoading, error: productsError } = useProductList(open)
  const { mutate: createCart, loading: cartLoading } = useCartCreate()
  const { mutate: createCartProducts, loading: cartProductsLoading } = useBulkCartProductCreate()

  const steps = ['Bind Table', 'Add Products']

  const handleClose = () => {
    setOpen(false)
    setActiveStep(0)
    setTableNumber('')
    setSelectedProducts([])
    setCreatedCartId(null)
  }

  const handleNext = async () => {
    if (activeStep === 0) {
      // Create cart with table binding
      if (!tableNumber) {
        alert('Please enter table number')

        return
      }

      try {
        const cartResponse = await createCart({
          data: {
            organizationKey: ORGANIZATION_KEY,
            person: person.id,
            tableNumber: Number(tableNumber)
          }
        })

        if (cartResponse?.id) {
          setCreatedCartId(cartResponse.id)
          setActiveStep(1)
        }
      } catch (error) {
        console.error('Error creating cart:', error)
        alert('Failed to create cart')
      }
    } else if (activeStep === 1) {
      // Add products to cart
      if (selectedProducts.length === 0) {
        alert('Please select at least one product')

        return
      }

      try {
        const cartProducts = selectedProducts.map(productId => ({
          organizationKey: ORGANIZATION_KEY || '',
          cart: createdCartId!,
          product: productId
        }))

        await createCartProducts({ data: { cartProducts } })

        const selectedProductsData =
          productsData?.results?.filter((product: ProductType) => selectedProducts.includes(product.id)) || []

        onSuccess?.({
          tableNumber: Number(tableNumber),
          products: selectedProductsData
        })
        handleClose()
      } catch (error) {
        console.error('Error adding products to cart:', error)
        alert('Failed to add products to cart')
      }
    }
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => (prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]))
  }

  const isStepValid = () => {
    if (activeStep === 0) {
      return tableNumber !== '' && Number(tableNumber) > 0
    }

    if (activeStep === 1) {
      return selectedProducts.length > 0
    }

    return false
  }

  const isLoading = cartLoading || cartProductsLoading

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Create Order for {person.fullName}
        <Typography component='span' className='flex flex-col text-center text-sm text-muted-foreground'>
          Bind table and add products to create a new order
        </Typography>
      </DialogTitle>

      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        {/* Stepper */}
        <Box className='mbe-6'>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step 1: Table Binding */}
        {activeStep === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant='h6' className='flex items-center gap-2 mbe-4'>
                    <i className='tabler-table' />
                    Table Information
                  </Typography>

                  <CustomTextField
                    fullWidth
                    label='Table Number'
                    type='number'
                    placeholder='Enter table number'
                    value={tableNumber}
                    onChange={e => setTableNumber(e.target.value ? Number(e.target.value) : '')}
                    helperText='Enter the table number where the customer is seated'
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Step 2: Product Selection */}
        {activeStep === 1 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant='h6' className='flex items-center gap-2 mbe-4'>
                    <i className='tabler-shopping-cart' />
                    Select Products
                  </Typography>

                  {productsLoading ? (
                    <Box className='flex justify-center py-8'>
                      <CircularProgress />
                    </Box>
                  ) : productsError ? (
                    <Alert severity='error'>Failed to load products</Alert>
                  ) : productsData?.results && productsData.results.length > 0 ? (
                    <Box>
                      <Typography variant='body2' className='mbe-3 text-muted-foreground'>
                        Select products to add to the order:
                      </Typography>
                      <Box className='flex flex-wrap gap-2'>
                        {productsData.results.map((product: ProductType) => (
                          <Chip
                            key={product.id}
                            label={product.name}
                            color={selectedProducts.includes(product.id) ? 'primary' : 'default'}
                            variant={selectedProducts.includes(product.id) ? 'filled' : 'outlined'}
                            onClick={() => handleProductToggle(product.id)}
                            className='cursor-pointer'
                          />
                        ))}
                      </Box>
                      <Typography variant='caption' className='mt-2 block text-muted-foreground'>
                        Selected: {selectedProducts.length} product(s)
                      </Typography>
                    </Box>
                  ) : (
                    <Alert severity='info'>No products available</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions className='justify-between pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='outlined' onClick={activeStep === 0 ? handleClose : handleBack} disabled={isLoading}>
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>

        <Button
          variant='contained'
          onClick={handleNext}
          disabled={!isStepValid() || isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
        >
          {isLoading ? 'Processing...' : activeStep === 0 ? 'Next' : 'Create Order'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TableBindingDialog

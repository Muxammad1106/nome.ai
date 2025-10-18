'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import DialogCloseButton from '../dialogs/DialogCloseButton'
import UserEditDialog from './UserEditDialog'

import type { PersonType } from '@/types'
import { usePersonAISummary, usePersonDetailWithCarts } from '../../services/persons'
import UserDetailLeftSide from './UserDetailLeftSide'
import UserDetailAISummaryBlock from './UserDetailAISummaryBlock'
import UserDetailOrderHistoryBlock from './UserDetailOrderHistoryBlock'
import TableBindingDialog from './TableBindingDialog'

type UserDetailDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  person: PersonType
  onPersonUpdate?: (person: PersonType) => void
}

const UserDetailDialog = ({ open, setOpen, person, onPersonUpdate }: UserDetailDialogProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [tableBindingDialogOpen, setTableBindingDialogOpen] = useState(false)
  const { data: summary, loading: summaryLoading, error: summaryError } = usePersonAISummary(person.id, open)

  const {
    data: personDetail,
    setData: setPersonDetail,
    loading: personDetailLoading,
    error: personDetailError
  } = usePersonDetailWithCarts(person.id, open)

  const handleClose = () => {
    setOpen(false)
  }

  const handlePersonUpdate = (updatedPerson: PersonType) => {
    onPersonUpdate?.(updatedPerson)
    setEditDialogOpen(false)
  }

  const handleTableBindingSuccess = (newOrderData: { tableNumber: number; products: any[] }) => {
    if (personDetail) {
      // Create new cart object
      const newCart = {
        id: `temp-${Date.now()}`, // Temporary ID for new cart
        tableNumber: newOrderData.tableNumber,
        cartProducts: newOrderData.products.map((product: any) => ({
          id: `temp-${Date.now()}-${product.id}`,
          productId: product.id,
          productName: product.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })),
        totalProducts: newOrderData.products.length.toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Update personDetail with new cart
      setPersonDetail({
        ...personDetail,
        carts: [newCart, ...personDetail.carts],
        totalCarts: (parseInt(personDetail.totalCarts) + 1).toString(),
        totalProductsInCarts: (parseInt(personDetail.totalProductsInCarts) + newOrderData.products.length).toString()
      })
    }
  }

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        maxWidth='lg'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>

        <DialogContent className='overflow-visible pbs-12 sm:pli-12'>
          <Grid container spacing={4}>
            <UserDetailLeftSide person={person} openEditModal={() => setEditDialogOpen(true)} />

            {/* Right Side - AI Suggestions and Orders */}
            <Grid item xs={12} md={7}>
              <Grid container spacing={3}>
                {/* AI Suggestions */}
                <Grid item xs={12}>
                  <UserDetailAISummaryBlock summary={summary} loading={summaryLoading} error={summaryError} />
                </Grid>

                <Grid item xs={12}>
                  <UserDetailOrderHistoryBlock
                    personDetail={personDetail}
                    loading={personDetailLoading}
                    error={personDetailError}
                    onAddOrder={() => {
                      setTableBindingDialogOpen(true)
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className='justify-end pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <UserEditDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        person={person}
        onSuccess={handlePersonUpdate}
      />

      {/* Table Binding Dialog */}
      <TableBindingDialog
        open={tableBindingDialogOpen}
        setOpen={setTableBindingDialogOpen}
        person={person}
        onSuccess={handleTableBindingSuccess}
      />
    </>
  )
}

export default UserDetailDialog

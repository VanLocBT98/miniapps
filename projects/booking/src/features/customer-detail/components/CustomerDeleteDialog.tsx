import { Button, Modal } from '@repo/ui'
import type { Customer } from '@/shared/types'

export function CustomerDeleteDialog({
  customer,
  open,
  pending,
  onClose,
  onConfirm,
}: {
  customer: Customer
  open: boolean
  pending?: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Modal
      open={open}
      title="Delete customer"
      onClose={() => {
        if (!pending) onClose()
      }}
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-300">
          Delete{' '}
          <span className="font-medium text-slate-50">
            {customer.fullName}
          </span>{' '}
          (<span className="text-slate-200">{customer.customerCode}</span>)?
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-400">
          <li>
            Customer is soft-deleted (<code className="text-slate-300">deleted_at</code>
            ) and hidden from the list.
          </li>
          <li>Row stays in the database (not permanently removed).</li>
        </ul>
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={pending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            variant="danger"
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? 'Deleting…' : 'Confirm delete'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

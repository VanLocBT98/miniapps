import { useSuspenseQuery } from '@tanstack/react-query'
import { DocumentViewer } from '@/features/documents'
import { bookingDocumentsQueryOptions } from '@/shared/services/apis/apis'

export default function DocumentsPage({ bookingId }: { bookingId: string }) {
  const { data: documents } = useSuspenseQuery(
    bookingDocumentsQueryOptions(bookingId),
  )

  return <DocumentViewer documents={documents} />
}

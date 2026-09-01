import LoveQRCardGenerator from '../../components/LoveQRCardGenerator'
import { copyText, invitationUrl } from '../../lib/utils'

/** ManageLoveQr — diekstrak verbatim dari Manage.jsx (Fase 3c, perilaku identik). */
export default function ManageLoveQr({ item  }) {
  return (

          <div className="space-y-6">
            <LoveQRCardGenerator
              invitationUrl={invitationUrl(slug)}
              names={
                item?.groom?.nick && item?.groom?.nick !== item?.bride?.nick
                  ? `${item?.bride?.nick} & ${item?.groom?.nick}`
                  : item?.bride?.nick || item?.customerName || 'Acara Spesial'
              }
              eventType={item?.eventType || 'birthday'}
              orderCode={item?.orderCode}
              photo={item?.bride?.photo}
              date={item?.date}
            />
          </div>
  )
}

import {
  caution, success, error,
  book, sendemail, request,
  verifieddocument, senddocument, searchgraphic, graphicstable,
  emptystateday, calendar, analyzedoc, computerfrontend,
  unspentbalancerule, bbvamanagerman1, books, sendticket, belldark, bell,
  funneldark, blockchain, info,
  balance
} from '@bbva-web-components/bbva-foundations-microillustrations'
import { LitElement } from 'lit-element'

// Register microillustration
export class MicroCaution extends LitElement { render () { return caution } }
export class MicroInfo extends LitElement { render () { return info } }
export class MicroSuccess extends LitElement { render () { return success } }
export class MicroError extends LitElement { render () { return error } }
export class MicroBook extends LitElement { render () { return book } }
export class MicroBooks extends LitElement { render () { return books } }
export class MicroSendemail extends LitElement { render () { return sendemail } }
export class MicroRequest extends LitElement { render () { return request } }
export class MicroVerifiedDocument extends LitElement { render () { return verifieddocument } }
export class MicroSendDocument extends LitElement { render () { return senddocument } }
export class MicroSearchGraphic extends LitElement { render () { return searchgraphic } }
export class MicroGraphicStable extends LitElement { render () { return graphicstable } }
export class MicroEmptyStateDay extends LitElement { render () { return emptystateday } }
export class MicroCalendar extends LitElement { render () { return calendar } }
export class MicroAnalyzeDoc extends LitElement { render () { return analyzedoc } }
export class MicroComputedFrontend extends LitElement { render () { return computerfrontend } }
export class MicroUnspentBalanceRule extends LitElement { render () { return unspentbalancerule } }
export class MicroManagerMan extends LitElement { render () { return bbvamanagerman1 } }
export class MicroSendTicket extends LitElement { render () { return sendticket } }
export class MicroBell extends LitElement { render () { return bell } }
export class MicroBellDark extends LitElement { render () { return belldark } }
export class MicroFunnel extends LitElement { render () { return funneldark } }
export class MicroBlockchain extends LitElement { render () { return blockchain } }
export class MicroBalance extends LitElement { render () { return balance }}

customElements.define('micro-caution', MicroCaution)
customElements.define('micro-success', MicroSuccess)
customElements.define('micro-error', MicroError)
customElements.define('micro-book', MicroBook)
customElements.define('micro-books', MicroBooks)
customElements.define('micro-sendemail', MicroSendemail)
customElements.define('micro-request', MicroRequest)
customElements.define('micro-verified-document', MicroVerifiedDocument)
customElements.define('micro-send-document', MicroSendDocument)
customElements.define('micro-search-graphic', MicroSearchGraphic)
customElements.define('micro-graphic-stable', MicroGraphicStable)
customElements.define('micro-empty-state-day', MicroEmptyStateDay)
customElements.define('micro-calendar', MicroCalendar)
customElements.define('micro-analyze-doc', MicroAnalyzeDoc)
customElements.define('micro-computer-frontend', MicroComputedFrontend)
customElements.define('micro-unspent-balance-rule', MicroUnspentBalanceRule)
customElements.define('micro-manager-man', MicroManagerMan)
customElements.define('micro-send-ticket', MicroSendTicket)
customElements.define('micro-bell', MicroBell)
customElements.define('micro-bell-dark', MicroBellDark)
customElements.define('micro-funnel', MicroFunnel)
customElements.define('micro-blockchain', MicroBlockchain)
customElements.define('micro-balance', MicroBalance)

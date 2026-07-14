import { Activity, CircleGauge, FileClock, KeyRound, LayoutDashboard } from 'lucide-react'

type PreviewCopy = {
  status: string
  navigation: string[]
  workspace: string
  title: string
  active: string
  metrics: { label: string; value: string }[]
  issueTitle: string
  profile: string
  fields: { label: string; value: string }[]
  delivery: string
  ready: string
}

const NAV_ICONS = [LayoutDashboard, KeyRound, FileClock, Activity, CircleGauge]

export function ProductPreview({ copy }: { copy: PreviewCopy }) {
  return (
    <div className="product-preview" aria-label="IterLoop API console preview">
      <div className="preview-topbar">
        <div>
          <span className="status-dot" />
          <code>console.iter-loop.com</code>
        </div>
        <span>{copy.status}</span>
      </div>
      <div className="preview-body">
        <aside className="preview-sidebar">
          <div className="preview-brand">
            <span className="mini-logo" />
            IterLoop API
          </div>
          <nav>
            {copy.navigation.map((item, index) => {
              const Icon = NAV_ICONS[index]
              return (
                <div className={index === 3 ? 'is-selected' : ''} key={item}>
                  <Icon size={14} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              )
            })}
          </nav>
        </aside>

        <div className="preview-workspace">
          <div className="workspace-heading">
            <div>
              <span>{copy.workspace}</span>
              <h2>{copy.title}</h2>
            </div>
            <strong>
              <span className="status-dot" />
              {copy.active}
            </strong>
          </div>

          <div className="preview-metrics">
            {copy.metrics.map((metric) => (
              <div key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>

          <div className="issuance-preview">
            <div className="issuance-form">
              <div className="issuance-heading">
                <strong>{copy.issueTitle}</strong>
                <span>{copy.profile}</span>
              </div>
              <div className="field-list">
                {copy.fields.map((field) => (
                  <div key={field.label}>
                    <span>{field.label}</span>
                    <strong>{field.value}</strong>
                  </div>
                ))}
              </div>
              <div className="model-list">
                <span><code>gpt-5.5</code><b>Codex · 0.4x</b></span>
                <span><code>claude-sonnet-4-6</code><b>Claude · 0.7x</b></span>
              </div>
            </div>
            <div className="delivery-preview">
              <div>
                <strong>{copy.delivery}</strong>
                <span>{copy.ready}</span>
              </div>
              <dl>
                <dt>BASE_URL</dt>
                <dd>https://api.iter-loop.com/v1</dd>
                <dt>API_KEY</dt>
                <dd>sk-iterloop-••••••••9a2f</dd>
              </dl>
              <pre>{`model_provider = "iterloop"
supports_websockets = false`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

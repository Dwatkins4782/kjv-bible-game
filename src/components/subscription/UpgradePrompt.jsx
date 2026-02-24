import { Link } from 'react-router-dom'
import { getRequiredTierName } from '../../utils/contentGating'

export default function UpgradePrompt({ requiredTier = 'basic', feature = 'this content', compact = false }) {
  const tierName = getRequiredTierName(requiredTier)

  if (compact) {
    return (
      <Link to="/pricing" className="upgrade-prompt-compact">
        Upgrade to {tierName} to unlock
      </Link>
    )
  }

  return (
    <div className="upgrade-prompt">
      <div className="upgrade-prompt-icon">&#128274;</div>
      <h3>Upgrade to {tierName}</h3>
      <p>Unlock {feature} and more with a {tierName} subscription.</p>
      {requiredTier === 'premium' && (
        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
          Includes <strong>Audio Recite</strong> &mdash; hear every scripture read aloud!
        </p>
      )}
      <Link to="/pricing" className="btn btn-primary" style={{ marginTop: '12px' }}>
        View Plans
      </Link>
    </div>
  )
}

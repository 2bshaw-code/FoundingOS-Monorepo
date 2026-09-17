/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/

import { PremiumSocialLinks } from './social-links'

export function FoundingOSFooter() {
  return (
    <footer className="foundingos-footer">
      <PremiumSocialLinks
        accent="#4CC9FF"
        mode="inline"
        label="Follow FoundingOS"
        networks={['instagram', 'linkedin', 'tiktok', 'x', 'facebook', 'youtube']}
      />
      <p style={{ margin: "0 0 6px" }}>FoundingOS — The Operating System for WhatsApp, Telegram, and global message-based businesses.</p>
      <p style={{ margin: 0 }}>© 2024–2026 FoundingOS. All rights reserved. Unauthorized copying, distribution, or modification is strictly prohibited.</p>
    </footer>
  );
}

export default FoundingOSFooter;

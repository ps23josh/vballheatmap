// Volleyball court dimensions (in meters, scaled for canvas)
const COURT_DIMENSIONS = {
  // Official volleyball court is 18m x 9m
  width: 540, // 18m * 30 pixels per meter
  height: 270, // 9m * 30 pixels per meter
  lineWidth: 2,
  netHeight: 90, // Scaled net height for visual representation
};

const COLORS = {
  court: '#D4A574', // Sandy court color
  lines: '#FFFFFF', // White lines
  net: '#2D3748', // Dark net color
  background: '#8FBC8F', // Light green background (surrounding area)
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const generateVolleyballCourt = (): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      // Create canvas with padding around the court
      const padding = 60;
      const canvasWidth = COURT_DIMENSIONS.width + (padding * 2);
      const canvasHeight = COURT_DIMENSIONS.height + (padding * 2);
      
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Clear canvas with background color
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Court position (centered with padding)
      const courtX = padding;
      const courtY = padding;

      // Draw court shadow for depth
      ctx.fillStyle = COLORS.shadow;
      ctx.fillRect(courtX + 4, courtY + 4, COURT_DIMENSIONS.width, COURT_DIMENSIONS.height);

      // Draw main court area
      ctx.fillStyle = COLORS.court;
      ctx.fillRect(courtX, courtY, COURT_DIMENSIONS.width, COURT_DIMENSIONS.height);

      // Set line drawing properties
      ctx.strokeStyle = COLORS.lines;
      ctx.lineWidth = COURT_DIMENSIONS.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw court boundary
      ctx.strokeRect(courtX, courtY, COURT_DIMENSIONS.width, COURT_DIMENSIONS.height);

      // Draw center line (divides court in half)
      const centerX = courtX + COURT_DIMENSIONS.width / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, courtY);
      ctx.lineTo(centerX, courtY + COURT_DIMENSIONS.height);
      ctx.stroke();

      // Draw attack lines (3m from center line on each side)
      const attackLineDistance = 90; // 3m * 30 pixels per meter
      
      // Left attack line
      const leftAttackX = centerX - attackLineDistance;
      ctx.beginPath();
      ctx.moveTo(leftAttackX, courtY);
      ctx.lineTo(leftAttackX, courtY + COURT_DIMENSIONS.height);
      ctx.stroke();

      // Right attack line
      const rightAttackX = centerX + attackLineDistance;
      ctx.beginPath();
      ctx.moveTo(rightAttackX, courtY);
      ctx.lineTo(rightAttackX, courtY + COURT_DIMENSIONS.height);
      ctx.stroke();

      // Draw service areas (back court divisions)
      const serviceLineY1 = courtY + COURT_DIMENSIONS.height * 0.25;
      const serviceLineY2 = courtY + COURT_DIMENSIONS.height * 0.75;

      // Left service area lines
      ctx.beginPath();
      ctx.moveTo(courtX, serviceLineY1);
      ctx.lineTo(leftAttackX, serviceLineY1);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(courtX, serviceLineY2);
      ctx.lineTo(leftAttackX, serviceLineY2);
      ctx.stroke();

      // Right service area lines
      ctx.beginPath();
      ctx.moveTo(rightAttackX, serviceLineY1);
      ctx.lineTo(courtX + COURT_DIMENSIONS.width, serviceLineY1);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rightAttackX, serviceLineY2);
      ctx.lineTo(courtX + COURT_DIMENSIONS.width, serviceLineY2);
      ctx.stroke();

      // Draw net
      const netY = courtY - 10; // Net extends above court
      const netHeight = COURT_DIMENSIONS.height + 20; // Net extends below court too
      
      // Net posts
      ctx.fillStyle = COLORS.net;
      ctx.fillRect(centerX - 3, netY, 6, netHeight);

      // Net mesh pattern
      ctx.strokeStyle = COLORS.net;
      ctx.lineWidth = 1;
      
      // Vertical net lines
      for (let i = -15; i <= 15; i += 5) {
        ctx.beginPath();
        ctx.moveTo(centerX + i, netY);
        ctx.lineTo(centerX + i, netY + netHeight);
        ctx.stroke();
      }

      // Horizontal net lines
      for (let i = 0; i <= netHeight; i += 8) {
        ctx.beginPath();
        ctx.moveTo(centerX - 15, netY + i);
        ctx.lineTo(centerX + 15, netY + i);
        ctx.stroke();
      }

      // Add court labels
      ctx.fillStyle = COLORS.lines;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Team A side
      ctx.fillText('Team A', courtX + COURT_DIMENSIONS.width * 0.25, courtY + COURT_DIMENSIONS.height * 0.5);
      
      // Team B side
      ctx.fillText('Team B', courtX + COURT_DIMENSIONS.width * 0.75, courtY + COURT_DIMENSIONS.height * 0.5);

      // Add dimensions text
      ctx.font = '12px Arial';
      ctx.fillStyle = COLORS.net;
      
      // Width dimension
      ctx.fillText('18m', courtX + COURT_DIMENSIONS.width / 2, courtY - 25);
      
      // Height dimension
      ctx.save();
      ctx.translate(courtX - 25, courtY + COURT_DIMENSIONS.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('9m', 0, 0);
      ctx.restore();

      // Convert canvas to blob and then to File
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'volleyball-court-default.png', {
            type: 'image/png',
            lastModified: Date.now(),
          });
          resolve(file);
        } else {
          reject(new Error('Failed to generate court image'));
        }
      }, 'image/png', 0.95);

    } catch (error) {
      reject(new Error(`Court generation failed: ${error}`));
    }
  });
};

// Alternative function to generate court as data URL for preview
export const generateCourtPreview = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    generateVolleyballCourt()
      .then(file => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert court to data URL'));
          }
        };
        reader.onerror = () => reject(new Error('FileReader error'));
        reader.readAsDataURL(file);
      })
      .catch(reject);
  });
};

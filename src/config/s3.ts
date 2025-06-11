// Configuration S3 centralisée
export const S3_CONFIG = {
  // Configuration de base
  bucketName: 'dreametrixbackendbucket',
  region: 'us-east-1',
  
  // Nouvelle baseUrl avec la région incluse
  get baseUrl() {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;
  },

  // Chemins des différents types de fichiers
  paths: {
    static: '/static',
    media: '/media',
    submissions: '/media/submissions/files'
  },

  // URL complètes (maintenant utilisant le getter baseUrl)
  urls: {
    static: () => `${S3_CONFIG.baseUrl}${S3_CONFIG.paths.static}`,
    media: () => `${S3_CONFIG.baseUrl}${S3_CONFIG.paths.media}`,
    submissionFile: (filename: string) => 
      `${S3_CONFIG.baseUrl}${S3_CONFIG.paths.submissions}/${filename}`
  },

  // Politique CORS recommandée
  corsPolicy: [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": []
    }
  ],

  // Politique de bucket recommandée
  bucketPolicy: {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::dreametrixbackendbucket/*"
      }
    ]
  }
};

// Helper pour corriger les URLs mal formatées
export const fixS3Url = (url: string): string => {
  if (!url) return '';
  
  // Si l'URL est déjà correcte (avec région)
  if (url.includes(`s3.${S3_CONFIG.region}.amazonaws.com`)) {
    return url;
  }
  
  // Correction des URLs sans région
  if (url.includes('s3.amazonaws.com')) {
    return url.replace(
      /^(https?:\/\/dreametrixbackendbucket\.s3\.)amazonaws\.com/,
      `$1${S3_CONFIG.region}.amazonaws.com`
    );
  }
  
  // Pour les chemins relatifs
  if (url.startsWith('/')) {
    return `${S3_CONFIG.baseUrl}${url}`;
  }
  
  // Pour les noms de fichier seuls
  return `${S3_CONFIG.baseUrl}/media/${url}`;
};
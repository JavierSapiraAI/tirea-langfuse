# Tirea Langfuse Fork

Fork personalizado de [Langfuse](https://langfuse.com) con branding de Tirea para uso interno.

## Características

- **Branding Tirea**: Logo, colores corporativos (#0066CC, #00A3E0), y títulos personalizados
- **Imágenes Docker**: Publicadas en GitHub Container Registry
- **Configuración simplificada**: Docker Compose listo para usar

## Quick Start (Local)

```bash
# 1. Clonar el repositorio
git clone https://github.com/JavierSapiraAI/tirea-langfuse.git
cd tirea-langfuse

# 2. Login a GitHub Container Registry
gh auth token | docker login ghcr.io -u TU_USUARIO --password-stdin

# 3. Iniciar servicios
docker compose -f docker-compose.tirea.yml up -d

# 4. Acceder
open http://localhost:3000
```

### Credenciales por defecto

| Campo | Valor |
|-------|-------|
| Email | `admin@tirea.com` |
| Password | `password123` |
| Organización | Tirea |
| Proyecto | Tirea AI |
| Public Key | `pk-tirea-local` |
| Secret Key | `sk-tirea-local` |

## Imágenes Docker

| Imagen | Tag | Registry |
|--------|-----|----------|
| Web | `tirea-custom` | `ghcr.io/javiersapiraai/tirea-langfuse-web` |
| Worker | `tirea-custom` | `ghcr.io/javiersapiraai/tirea-langfuse-worker` |

### Pull manual

```bash
docker pull ghcr.io/javiersapiraai/tirea-langfuse-web:tirea-custom
docker pull ghcr.io/javiersapiraai/tirea-langfuse-worker:tirea-custom
```

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Tirea Langfuse Stack                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐                           │
│  │ langfuse-web│  │langfuse-    │  ← Imágenes custom Tirea  │
│  │   :3000     │  │worker :3030 │                           │
│  └──────┬──────┘  └──────┬──────┘                           │
│         │                │                                   │
│  ┌──────┴────────────────┴──────┐                           │
│  │        Servicios Base        │                           │
│  ├──────────┬──────────┬────────┤                           │
│  │PostgreSQL│ClickHouse│ Redis  │  MinIO                    │
│  │  :5432   │  :8123    │ :6379  │  :9090                    │
│  └──────────┴──────────┴────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

## Archivos Modificados (vs Upstream)

### Branding Visual

| Archivo | Cambio |
|---------|--------|
| `web/public/tirea-logo.png` | Logo de Tirea |
| `web/src/components/LangfuseLogo.tsx` | Usa logo y nombre "Tirea" |
| `web/tailwind.config.ts` | Colores corporativos Tirea |
| `web/src/styles/globals.css` | Variables CSS Tirea |

### Títulos de Página

| Archivo | Título |
|---------|--------|
| `web/src/components/layouts/app-layout/hooks/useLayoutMetadata.ts` | `{Page} \| Tirea` |
| `web/src/pages/auth/sign-in.tsx` | `Sign in \| Tirea` |
| `web/src/pages/auth/sign-up.tsx` | `Sign up \| Tirea` |
| `web/src/pages/auth/sso-initiate.tsx` | `Signing in \| Tirea` |
| `web/src/pages/auth/enterprise-sso-required.tsx` | `Enterprise SSO Required \| Tirea` |
| `web/src/features/auth-credentials/components/ResetPasswordPage.tsx` | `Reset Password \| Tirea` |
| `web/src/pages/onboarding.tsx` | `Onboarding \| Tirea` |

### CI/CD

| Archivo | Propósito |
|---------|-----------|
| `.github/workflows/tirea-docker-build.yml` | Build y push de imágenes Docker |
| `docker-compose.tirea.yml` | Deployment local |

## Desarrollo

### Branch principal

```
tirea-custom  ← Branch con cambios de Tirea
main          ← Sincronizado con upstream (langfuse/langfuse)
```

### Sincronizar con upstream

```bash
# Agregar upstream si no existe
git remote add upstream https://github.com/langfuse/langfuse.git

# Fetch y merge
git fetch upstream
git checkout main
git merge upstream/main

# Rebase tirea-custom sobre main actualizado
git checkout tirea-custom
git rebase main
```

### Rebuild de imágenes

Las imágenes se rebuildan automáticamente en cada push a `tirea-custom`. Para forzar rebuild manual:

```bash
gh workflow run "Build and Push Docker Images" --ref tirea-custom
```

## Configuración de Producción

### Variables de entorno críticas

```bash
# CAMBIAR EN PRODUCCIÓN
ENCRYPTION_KEY=<openssl rand -hex 32>
NEXTAUTH_SECRET=<openssl rand -base64 32>
SALT=<valor-aleatorio>
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_AUTH=<password-redis>
CLICKHOUSE_PASSWORD=<password-clickhouse>
```

### Helm (Kubernetes)

```yaml
# values.yaml para EKS
langfuse:
  web:
    image:
      repository: ghcr.io/javiersapiraai/tirea-langfuse-web
      tag: tirea-custom
  worker:
    image:
      repository: ghcr.io/javiersapiraai/tirea-langfuse-worker
      tag: tirea-custom
```

## Comandos Útiles

```bash
# Ver logs
docker compose -f docker-compose.tirea.yml logs -f langfuse-web

# Reiniciar servicios
docker compose -f docker-compose.tirea.yml restart

# Parar todo
docker compose -f docker-compose.tirea.yml down

# Limpiar volumes (BORRA DATOS)
docker compose -f docker-compose.tirea.yml down -v

# Actualizar imágenes
docker compose -f docker-compose.tirea.yml pull
docker compose -f docker-compose.tirea.yml up -d
```

## Integración con Scripts Tirea

Los scripts de evaluación en `tirea-doc-hub-backoffice/scripts/` pueden conectarse a esta instancia:

```javascript
// Configuración para Langfuse local
const langfuse = new Langfuse({
  publicKey: 'pk-tirea-local',
  secretKey: 'sk-tirea-local',
  baseUrl: 'http://localhost:3000'
});
```

## Deploy a EKS (Producción)

### Ambiente Actual

| Componente | Valor |
|------------|-------|
| Cluster | `langfuse-backoffice-dev` |
| Region | `eu-west-2` |
| Namespace | `langfuse` |
| ALB | `k8s-langfuse-langfuse-7d7be38ca9-*.eu-west-2.elb.amazonaws.com` |

### Configuración de Imágenes en EKS

```bash
# 1. Crear secret para ghcr.io
GITHUB_TOKEN=$(gh auth token) && kubectl create secret docker-registry ghcr-tirea-secret \
  --namespace=langfuse \
  --docker-server=ghcr.io \
  --docker-username=JavierSapiraAI \
  --docker-password="$GITHUB_TOKEN" \
  --docker-email=admin@tirea.com

# 2. Actualizar deployments con imágenes Tirea
kubectl set image deployment/langfuse-web \
  langfuse=ghcr.io/javiersapiraai/tirea-langfuse-web:tirea-custom \
  -n langfuse

kubectl set image deployment/langfuse-worker \
  langfuse=ghcr.io/javiersapiraai/tirea-langfuse-worker:tirea-custom \
  -n langfuse

# 3. Añadir imagePullSecrets
kubectl patch deployment langfuse-web -n langfuse \
  --type='json' -p='[{"op": "add", "path": "/spec/template/spec/imagePullSecrets", "value": [{"name": "ghcr-tirea-secret"}]}]'

kubectl patch deployment langfuse-worker -n langfuse \
  --type='json' -p='[{"op": "add", "path": "/spec/template/spec/imagePullSecrets", "value": [{"name": "ghcr-tirea-secret"}]}]'

# 4. Verificar rollout
kubectl rollout status deployment/langfuse-web -n langfuse
kubectl rollout status deployment/langfuse-worker -n langfuse
```

### Helm Values (Alternativo)

Para nuevos deployments usar el archivo `langfuse-values.yaml`:

```yaml
langfuse:
  image:
    pullSecrets:
      - name: ghcr-tirea-secret
  web:
    image:
      repository: ghcr.io/javiersapiraai/tirea-langfuse-web
      tag: tirea-custom
  worker:
    image:
      repository: ghcr.io/javiersapiraai/tirea-langfuse-worker
      tag: tirea-custom
```

### Monitoreo

```bash
# Ver pods
kubectl get pods -n langfuse

# Ver logs web
kubectl logs -n langfuse -l app.kubernetes.io/component=web -f

# Ver logs worker
kubectl logs -n langfuse -l app.kubernetes.io/component=worker -f

# Health check
curl -s "<ALB-URL>/api/public/health"
```

## Soporte

- **Repositorio**: https://github.com/JavierSapiraAI/tirea-langfuse
- **Branch**: `tirea-custom`
- **Linear**: SAI-643
- **Runbook**: `tirea-doc-hub-backoffice/docs/operations/TIREA_LANGFUSE_RUNBOOK.md`

---

*Fork mantenido por el equipo de Tirea AI*
*Última actualización: Diciembre 2025*

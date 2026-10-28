# Dominio oliviapasteleria.com.ar

## Estado
- El dominio **ya está agregado al proyecto `olivia-cafe` de Vercel**, junto con `www.oliviapasteleria.com.ar`.
- `www` redirige al dominio sin `www` (regla en `vercel.json`).
- `NEXT_PUBLIC_SITE_URL` en Vercel ya es `https://oliviapasteleria.com.ar` (se usa en SEO, sitemap, Open Graph y datos estructurados).
- Los nameservers de Vercel ya responden por la zona del dominio.
- Falta solo la **delegación en NIC.ar** (ver abajo).

## Delegación en NIC.ar
1. Ingresá a https://nic.ar con tu cuenta y abrí tus dominios → `oliviapasteleria.com.ar` → **Delegar / Modificar delegación**.
2. Cargá estos **dos servidores DNS** (solo los nombres, sin IP):

   | Servidor DNS |
   |---|
   | `ns1.vercel-dns.com` |
   | `ns2.vercel-dns.com` |

3. Guardá. NIC.ar valida la delegación y la publica; puede tardar desde unos minutos hasta algunas horas (a veces hasta 48 h).
4. Cuando propague, Vercel emite el certificado HTTPS solo. Podés comprobarlo con:
   ```bash
   vercel domains inspect oliviapasteleria.com.ar
   ```
   Tiene que mostrar los *Current Nameservers* iguales a los *Intended* (✔), o verse "Valid Configuration" en Vercel → Project → Settings → Domains.

## Si prefieren no cambiar los nameservers
En lugar de delegar en Vercel se pueden dejar los nameservers de NIC.ar (o los de otro proveedor) y cargar en su DNS:

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` (dominio raíz) | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

## Cosas a tener en cuenta
- **Mail con el dominio:** al delegar en Vercel, el DNS pasa a administrarse en Vercel. Si en algún momento usan mails `@oliviapasteleria.com.ar`, los registros MX hay que cargarlos en Vercel (`vercel dns add oliviapasteleria.com.ar @ MX <servidor> 10`) o desde Vercel → Domains → DNS Records. Hoy el mail del local es de Gmail, así que no afecta.
- **Panel de administración:** pasa a ser https://oliviapasteleria.com.ar/admin. Como es otro dominio, hay que volver a iniciar sesión. La dirección `olivia-cafe-mauve.vercel.app` sigue funcionando.
- **Google:** el sitio sigue con `noindex` para que no lo indexen con textos pendientes. Cuando esté todo listo, poné `NEXT_PUBLIC_ALLOW_INDEXING=true` en Vercel y volvé a desplegar.
- Hasta que la delegación propague, los enlaces compartidos (WhatsApp, redes) con la imagen de vista previa pueden no mostrarla, porque apuntan al dominio nuevo.

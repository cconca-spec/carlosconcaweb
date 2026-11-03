import { defineQuery } from 'next-sanity'

export const PUBLICATIONS_QUERY = defineQuery(`
  *[_type == "publication"] | order(year desc, title asc) {
    _id, title, citation, year, category, collaborators, link, featured
  }
`)

// Las páginas tienen ID fijo `{type}-{locale}`. El detalle de cada proyección
// se afina cuando se construye la página (Fase 3).
export const HOME_PAGE_QUERY = defineQuery(`*[_id == $id && _type == "homePage"][0]`)
export const BIOGRAFIA_PAGE_QUERY = defineQuery(`*[_id == $id && _type == "biografiaPage"][0]`)
export const INVESTIGACION_PAGE_QUERY = defineQuery(`*[_id == $id && _type == "investigacionPage"][0]`)
export const DOCENCIA_PAGE_QUERY = defineQuery(`*[_id == $id && _type == "docenciaPage"][0]`)
export const PUBLICACIONES_PAGE_QUERY = defineQuery(`*[_id == $id && _type == "publicacionesPage"][0]`)
export const CONTACTO_PAGE_QUERY = defineQuery(`*[_id == $id && _type == "contactoPage"][0]`)
export const PRIVACIDAD_PAGE_QUERY = defineQuery(`*[_id == $id && _type == "privacidadPage"][0]`)
export const TERMINOS_PAGE_QUERY = defineQuery(`*[_id == $id && _type == "terminosPage"][0]`)
export const SITE_SETTINGS_QUERY = defineQuery(`*[_id == $id && _type == "siteSettings"][0]{
  ...,
  "cvUrl": cv.asset->url
}`)

// Fechas de última edición para el sitemap: una por página/idioma y la de la publicación más reciente.
export const CONTENT_DATES_QUERY = defineQuery(`{
  "pages": *[_type in $pageTypes]{ _type, language, _updatedAt },
  "publications": *[_type == "publication"] | order(_updatedAt desc)[0]._updatedAt
}`)

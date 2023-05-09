import { SCHEMA_INRUPT } from '@inrupt/vocab-common-rdf';

const RDF_PREDICATES = {
    ...SCHEMA_INRUPT,
    uploadDate: 'https://schema.org/uploadDate',
    checksum: 'checksum'
}

export default RDF_PREDICATES;
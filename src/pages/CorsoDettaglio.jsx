import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const CorsoDettaglio = () => {
  const { slug } = useParams();
  const [corso, setCorso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/corsi/${slug}`)
      .then(res => res.json())
      .then(data => {
        setCorso(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-6">🔄 Caricamento corso...</div>;
  if (!corso) return <div className="p-6 text-red-600">❌ Corso non trovato</div>;

  const {
    titolo, descrizione, durata, prezzo, ente_erogatore,
    certificazione, data_prossima_edizione, sede, prerequisiti, dotazioni
  } = corso;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": titolo,
    "description": descrizione,
    "provider": {
      "@type": "Organization",
      "name": ente_erogatore,
      "sameAs": "https://www.inquotus.it"
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Helmet>
        <title>{`${titolo} | Formazione Inquotus`}</title>
        <meta name="description" content={descrizione.slice(0, 160)} />
        <meta property="og:title" content={`${titolo} | Inquotus`} />
        <meta property="og:description" content={descrizione.slice(0, 160)} />
        <meta property="og:url" content={`https://www.inquotus.it/corso/${slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <h1 className="text-3xl font-bold mb-2">{titolo}</h1>
      <p className="text-gray-600 mb-4">{descrizione}</p>

      <div className="space-y-2">
        <p><strong>Durata:</strong> {durata}</p>
        <p><strong>Prezzo:</strong> € {prezzo}</p>
        <p><strong>Ente:</strong> {ente_erogatore}</p>
        <p><strong>Certificazione:</strong> {certificazione}</p>
        <p><strong>Prossima edizione:</strong> {data_prossima_edizione}</p>
        <p><strong>Sede:</strong> {sede}</p>
        <p><strong>Prerequisiti:</strong> {prerequisiti}</p>
        <p><strong>Dotazioni fornite:</strong> {dotazioni}</p>
      </div>
    </div>
  );
};

export default CorsoDettaglio;



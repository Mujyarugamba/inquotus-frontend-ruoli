import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners';

const RichiestaForm = ({
  loading = false,
  previewUrl = '',
  handleFileChange = () => {},
  onSubmit = () => {}
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm();

  const [categorie, setCategorie] = useState([]);
  const [regioni, setRegioni] = useState([]);
  const [province, setProvince] = useState([]);
  const [comuni, setComuni] = useState([]);

  const regioneSelezionata = watch("regione")?.value;
  const provinciaSelezionata = watch("provincia")?.value;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categorieRes, regioniRes] = await Promise.all([
          fetch('/data/categorie_raggruppate.json'),
          fetch('/data/regioni.json')
        ]);

        const [categorieData, regioniData] = await Promise.all([
          categorieRes.json(),
          regioniRes.json()
        ]);

        setCategorie(categorieData);
        setRegioni(regioniData);
      } catch (error) {
        console.error('Errore nel caricamento delle categorie o regioni:', error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProvince = async () => {
      if (!regioneSelezionata) return;
      try {
        const res = await fetch(`/data/province/${regioneSelezionata}.json`);
        const data = await res.json();
        setProvince(data);
      } catch (error) {
        console.error('Errore nel caricamento delle province:', error);
        setProvince([]);
      }
    };
    fetchProvince();
  }, [regioneSelezionata]);

  useEffect(() => {
    const fetchComuni = async () => {
      if (!provinciaSelezionata) return;
      try {
        const res = await fetch(`/data/comuni/${provinciaSelezionata}.json`);
        const data = await res.json();
        setComuni(data);
      } catch (error) {
        console.error('Errore nel caricamento dei comuni:', error);
        setComuni([]);
      }
    };
    fetchComuni();
  }, [provinciaSelezionata]);

  const toOptions = (arr) => {
    if (!arr || arr.length === 0) return [];
    return arr.map((val) => ({ label: val, value: val }));
  };

  const categorieOptions = categorie.flatMap((group) => {
    if (!group || !group.categorie) return [];
    return group.categorie.map((cat) => ({
      value: cat,
      label: `${group.gruppo} - ${cat}`
    }));
  });

  const customSelectStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 })
  };

  const inputClass =
    'w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-100 via-white to-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
          <ClipLoader size={50} color="#2563eb" />
        </div>
      )}
      <div className="grid grid-cols-5 gap-4 w-full max-w-7xl">
        <div className="col-span-1 flex justify-center items-center">
          <img src="/banner-sinistra.png" alt="Banner sinistro" className="max-w-full h-auto" />
        </div>
        <div className="col-span-3 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Richiedi un Preventivo</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* CONTENUTO FORM UGUALE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Tipo di intervento *</label>
              <Controller
                control={control}
                name="categoria"
                rules={{ required: 'Campo obbligatorio' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={categorieOptions}
                    placeholder="Seleziona categoria..."
                    styles={customSelectStyles}
                    menuPortalTarget={document.body}
                  />
                )}
              />
              {errors.categoria && <p className="text-sm text-red-500 mt-1">{errors.categoria.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Regione *</label>
              <Controller
                control={control}
                name="regione"
                rules={{ required: 'Campo obbligatorio' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={toOptions(regioni)}
                    placeholder="Seleziona regione..."
                    styles={customSelectStyles}
                    menuPortalTarget={document.body}
                  />
                )}
              />
              {errors.regione && <p className="text-sm text-red-500 mt-1">{errors.regione.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Provincia *</label>
              <Controller
                control={control}
                name="provincia"
                rules={{ required: 'Campo obbligatorio' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={toOptions(province)}
                    placeholder="Seleziona provincia..."
                    styles={customSelectStyles}
                    menuPortalTarget={document.body}
                  />
                )}
              />
              {errors.provincia && <p className="text-sm text-red-500 mt-1">{errors.provincia.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Comune *</label>
              <Controller
                control={control}
                name="localita"
                rules={{ required: 'Campo obbligatorio' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={toOptions(comuni)}
                    placeholder="Seleziona comune..."
                    styles={customSelectStyles}
                    menuPortalTarget={document.body}
                  />
                )}
              />
              {errors.localita && <p className="text-sm text-red-500 mt-1">{errors.localita.message}</p>}
            </div>
            <input type="text" placeholder="Nome *" {...register('nome', { required: 'Campo obbligatorio' })} className={inputClass} />
            <input type="email" placeholder="Email *" {...register('email', { required: 'Campo obbligatorio' })} className={inputClass} />
            <input type="tel" placeholder="Telefono *" {...register('telefono', { required: 'Campo obbligatorio' })} className={inputClass} />
            <textarea placeholder="Descrizione del lavoro" rows="4" {...register('descrizione')} className={inputClass} />
            <div>
              <label className="block text-sm font-semibold text-gray-700">Carica un'immagine (facoltativo)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
              {previewUrl && <img src={previewUrl} alt="preview" className="mt-4 rounded-md max-h-48" />}
            </div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register('urgente')} />
              <span className="text-sm text-gray-700">Segna come urgente</span>
            </label>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
              Invia la Richiesta
            </button>
          </form>
        </div>
        <div className="col-span-1 flex justify-center items-center">
          <img src="/banner-destra.png" alt="Banner destro" className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default RichiestaForm;






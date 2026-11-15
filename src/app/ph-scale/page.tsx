import { Alert } from "@/src/components/ui/Alert";
import { TEMPORARY_REF_TABLE } from "@/src/features/ph-analysis/data/ref-table";

const categoryName = { acid: "Asam", neutral: "Netral", base: "Basa" } as const;

export default function PhScalePage() {
  const references = [...TEMPORARY_REF_TABLE].sort((a, b) => a.ph - b.ph);

  return (
    <div className="reference-page page-shell">
      <header className="reference-page__header">
        <p className="editorial-kicker">Referensi</p>
        <h1>Skala pH yang digunakan</h1>
        <p>Skalah pH didasari pada perubahan warna saat di tetesi ekstrak kubis ungu</p>
      </header>

      {/* <Alert variant="warning" className="reference-page__alert">
        Dataset ini belum final. Jangan menggunakannya sebagai pengganti instrumen atau prosedur laboratorium.
      </Alert> */}

      <div className="scale-overview" aria-hidden="true">
        {references.map((item) => <span key={item.ph} style={{ backgroundColor: item.hexColor }} />)}
      </div>

      <div className="reference-table" role="table" aria-label="Tabel referensi pH sementara">
        <div className="reference-table__head" role="row">
          <span role="columnheader">pH</span><span role="columnheader">Warna</span><span role="columnheader">Referensi</span><span role="columnheader">Kategori</span><span role="columnheader">Hue</span>
        </div>
        {references.map((item) => (
          <div className="reference-table__row" role="row" key={item.ph}>
            <strong role="cell">{item.ph}</strong>
            <span role="cell" className="reference-table__swatch" style={{ backgroundColor: item.hexColor }} aria-label={`Warna ${item.label}`} />
            <span role="cell">{item.label}</span>
            <span role="cell">{categoryName[item.category]}</span>
            <span role="cell" className="tabular-nums">{item.hue}°</span>
          </div>
        ))}
      </div>

    </div>
  );
}

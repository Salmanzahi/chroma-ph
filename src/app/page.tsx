import Link from "next/link";
import { ArrowRightIcon, CameraIcon, InfoIcon } from "@/src/components/icons";
import { Reveal } from "@/src/components/motion/Reveal";
import { ReferenceRail } from "@/src/components/ph/ReferenceRail";
import { ROUTES } from "@/src/lib/constants";

const workflow = [
  ["01", "Ambil", "Gunakan kamera saat siap, atau pilih foto JPEG, PNG, maupun WebP dari perangkat."],
  ["02", "Tinjau", "Pastikan warna film berada di bidang sampel tengah. Analisis belum berjalan pada tahap ini."],
  ["03", "Baca", "Konfirmasikan foto untuk melihat estimasi pH, data warna, dan batas interpretasinya."],
] as const;

export default function HomePage() {
  return (
    <>
      <section className="folio-hero page-shell">
        <Reveal className="folio-hero__title" immediate>
          <p className="editorial-kicker">Film antosianin bunga telang</p>
          <h1>Warna film,<br /><em>dibaca sebagai pH.</em></h1>
        </Reveal>

        <div className="folio-hero__lower">
          <Reveal className="folio-hero__intro" delay={80} immediate>
            <p>Arahkan kamera ke indikator, periksa bidang warna yang dipilih, lalu jalankan estimasi langsung di perangkat.</p>
            <div className="hero-actions">
              <Link href={ROUTES.scan} className="button-primary">
                Mulai pemindaian <CameraIcon size={17} />
              </Link>
              <Link href={ROUTES.about} className="text-link">
                Catatan metode <ArrowRightIcon size={16} />
              </Link>
            </div>
          </Reveal>

          <Reveal className="specimen-field" delay={140} immediate>
            <div className="specimen-field__legend">
              <span>Bidang sampel</span><span>30% tengah gambar</span>
            </div>
            <div className="specimen-field__plane" aria-hidden="true">
              <span className="specimen-field__film" />
              <span className="specimen-field__target" />
              <span className="specimen-field__axis specimen-field__axis--x" />
              <span className="specimen-field__axis specimen-field__axis--y" />
            </div>
            <div className="specimen-field__caption"><span>RGB → HSL → estimasi pH</span><span>Tanpa unggahan server</span></div>
          </Reveal>
        </div>
      </section>

      <section className="boundary-strip" aria-labelledby="boundary-title">
        <div className="page-shell boundary-strip__grid">
          <p className="section-index">Batas / 00</p>
          <div>
            <h2 id="boundary-title"><InfoIcon size={20} /> Indikasi, bukan sertifikasi.</h2>
            <p>Rentang pH 5,5–7 menunjukkan indikasi kelayakan berdasarkan parameter penelitian. Hasil ini bukan jaminan keamanan pangan.</p>
          </div>
        </div>
      </section>

      <section className="indexed-section page-shell lazy-section" aria-labelledby="workflow-title">
        <header className="indexed-section__head">
          <p className="section-index">Prosedur / 01</p>
          <h2 id="workflow-title" className="section-title">Tiga keputusan.<br />Tidak ada langkah tersembunyi.</h2>
        </header>
        <div className="procedure-list">
          {workflow.map(([number, title, body], index) => (
            <Reveal key={number} delay={index * 70}>
              <article className="procedure-row">
                <span className="procedure-row__number">{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <ArrowRightIcon size={18} aria-hidden="true" />
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="reference-section lazy-section" aria-labelledby="reference-title">
        <div className="page-shell">
          <header className="indexed-section__head">
            <p className="section-index">Referensi / 02</p>
            <div>
              <h2 id="reference-title" className="section-title">Spektrum acuan yang digunakan pemindai.</h2>
              <p className="prose-copy">Nilai berikut berasal dari tabel teknis prototipe dan belum merupakan kalibrasi ilmiah final.</p>
            </div>
          </header>
          <Reveal><ReferenceRail /></Reveal>
          <Link href={ROUTES.phScale} className="reference-section__link">Lihat seluruh tabel <ArrowRightIcon size={17} /></Link>
        </div>
      </section>

      <section className="data-local page-shell lazy-section" aria-labelledby="local-title">
        <header className="data-local__head">
          <p className="section-index">Privasi / 03</p>
          <Reveal className="data-local__statement">
            <h2 id="local-title">Diproses di perangkat.<br /><em>Tetap dalam kendali Anda.</em></h2>
          </Reveal>
          <p className="data-local__intro">Pemindaian menggunakan API browser. Foto tidak dikirim ke server atau disimpan di cloud.</p>
        </header>
        <div className="privacy-flow" aria-label="Alur pemrosesan data lokal">
          <div className="privacy-flow__step"><span>01</span><strong>Kamera</strong><p>Aktif setelah Anda meminta akses.</p></div>
          <div className="privacy-flow__step"><span>02</span><strong>Canvas lokal</strong><p>Membaca piksel pada bidang sampel.</p></div>
          <div className="privacy-flow__step"><span>03</span><strong>Hasil sementara</strong><p>Tersedia hanya pada tab yang sama.</p></div>
        </div>
        <div className="privacy-boundary"><span aria-hidden="true">×</span><strong>Tidak melewati batas perangkat</strong><p>Tanpa unggahan gambar, akun, basis data, atau penyimpanan cloud.</p></div>
      </section>

      <section className="closing-line page-shell lazy-section">
        <div><p className="editorial-kicker">Siap mengukur</p><h2>Gunakan cahaya merata.<br />Biarkan warna yang berbicara.</h2></div>
        <Link href={ROUTES.scan} className="button-primary">Buka pemindai <ArrowRightIcon size={17} /></Link>
      </section>
    </>
  );
}

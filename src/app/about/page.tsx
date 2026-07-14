import { FlaskIcon, InfoIcon, LeafIcon } from "@/src/components/icons";
import { ABOUT, PLACEHOLDER } from "@/src/data/placeholder-content";

export default function AboutPage() {
  return (
    <div className="about-page page-shell">
      <header className="about-hero">
        <p className="editorial-kicker">Tentang proyek</p>
        <h1><span>Membaca warna</span><em>pada film bioplastik antosianin.</em></h1>
        <p>Catatan ringkas mengenai latar, ruang lingkup, dan informasi penelitian yang masih menunggu konfirmasi.</p>
      </header>

      <section className="about-story" aria-labelledby="background-title">
        <p className="section-index">Konteks / 01</p>
        <div>
          <div className="about-story__title"><LeafIcon size={22} /><h2 id="background-title">{ABOUT.backgroundTitle}</h2></div>
          <p>{ABOUT.backgroundDesc}</p>
        </div>
      </section>

      <section className="about-notes" aria-labelledby="scope-title">
        <header><p className="section-index">Ruang lingkup / 02</p><h2 id="scope-title">Apa yang sedang dipelajari.</h2></header>
        <div className="about-note-list">
          <article><span>01</span><FlaskIcon size={22} /><h3>{ABOUT.objectiveTitle}</h3><p>{ABOUT.objectiveDesc}</p></article>
          <article><span>02</span><InfoIcon size={22} /><h3>{ABOUT.materialTitle}</h3><p>{ABOUT.materialDesc}</p></article>
        </div>
      </section>

      <section className="about-process" aria-labelledby="process-title">
        <p className="section-index">Proses / 03</p>
        <div><h2 id="process-title">{ABOUT.processTitle}</h2><p>{ABOUT.processDesc}</p></div>
        <div className="about-process__line" aria-hidden="true"><span /><span /><span /></div>
      </section>

      <section className="identity-register" aria-labelledby="identity-title">
        <div><p className="editorial-kicker">Menunggu data klien</p><h2 id="identity-title">Identitas dan kredit</h2></div>
        <dl>
          <div><dt>Tim</dt><dd>{PLACEHOLDER.teamName}</dd></div>
          <div><dt>Organisasi</dt><dd>{PLACEHOLDER.organization}</dd></div>
          <div><dt>Institusi</dt><dd>{PLACEHOLDER.institution}</dd></div>
          <div><dt>Dokumentasi</dt><dd>{ABOUT.documentationDesc}</dd></div>
          <div><dt>Kredit</dt><dd>{ABOUT.creditsDesc}</dd></div>
        </dl>
      </section>
    </div>
  );
}

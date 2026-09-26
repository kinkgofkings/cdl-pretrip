import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Printer,
  Copy,
  Check,
  Search,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Truck,
  ExternalLink,
  Flame,
  ArrowRight
} from 'lucide-react';
import { ANCORA_PDF_PAGES, PdfPageData } from '../data/ancoraPdfData';
import { tts } from '../utils/speech';

interface Props {
  outdoorMode?: boolean;
}

export const PdfDocumentLightbox: React.FC<Props> = ({ outdoorMode }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasStarted, setHasStarted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentBodyRef = useRef<HTMLDivElement>(null);

  const totalPages = ANCORA_PDF_PAGES.length;
  const activePage: PdfPageData = ANCORA_PDF_PAGES[currentPage - 1];

  // Stop reading and reset scroll when page changes
  useEffect(() => {
    if (isReadingAloud) {
      tts.stop();
      setIsReadingAloud(false);
    }
    if (contentBodyRef.current) {
      contentBodyRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, hasStarted]);

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Touch Swipe Handlers for mobile & tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Minimum swipe threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped Left -> Next page
        goToNext();
      } else {
        // Swiped Right -> Previous page
        goToPrev();
      }
    }
    setTouchStartX(null);
  };

  const handleReadAloud = () => {
    if (isReadingAloud) {
      tts.stop();
      setIsReadingAloud(false);
    } else {
      setIsReadingAloud(true);
      const textToRead = `Ancora Pre-Trip Inspection Master Guide. Page ${activePage.pageNumber}. ${activePage.title}. Key checklist scripts: ${activePage.summaryHighlights.join('. ')}`;
      tts.speak(textToRead, {
        onEnd: () => setIsReadingAloud(false),
        onError: () => setIsReadingAloud(false)
      });
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(activePage.pdfExcerpt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter highlights if searching
  const filteredHighlights = searchQuery
    ? activePage.summaryHighlights.filter((h) =>
        h.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activePage.summaryHighlights;

  // ========================================================
  // BADASS TRUCKING SPLASH COVER (BEFORE ENTERING LIGHTBOX)
  // ========================================================
  if (!hasStarted) {
    return (
      <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 relative select-none">
        {/* Cinematic Backdrop Image with Vignette & Gradients */}
        <div className="relative w-full flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
          {/* Background Heavy Duty Rig Imagery */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=85')`,
              filter: 'brightness(0.35) contrast(1.2)'
            }}
          />

          {/* Gradients & Glow overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-blue-950/40" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Perspective grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 600 400" preserveAspectRatio="none">
            <line x1="0" y1="280" x2="600" y2="280" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 6" />
            <polygon points="260,280 340,280 580,400 20,400" fill="#030712" opacity="0.6" />
            <line x1="300" y1="280" x2="300" y2="400" stroke="#f59e0b" strokeWidth="3" strokeDasharray="16 20" />
          </svg>

          {/* Header Badges */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/40 backdrop-blur-md shadow-lg">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                Official Ancora Education & Laurel Ridge CDL
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-mono font-bold backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Full 6-Page Master Curriculum</span>
            </div>
          </div>

          {/* Hero Typography & Mission */}
          <div className="relative z-10 max-w-2xl my-auto py-8">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-widest text-sky-400 mb-2">
              <Truck className="w-4 h-4" />
              <span>Master Study Guide & Exam Script Checklist</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-none drop-shadow-2xl">
              Ancora Class A
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-300 to-amber-300">
                Pre-Trip PDF Vault
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 font-medium leading-relaxed drop-shadow">
              The complete original 6-page master inspection packet formatted in a badass, high-definition swipeable lightbox viewer. Includes every word-for-word examiner script, physical action protocol, COPS leak checks, and the critical failure air brake lab.
            </p>

            {/* Quick Page Preview Thumbnails */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-6">
              {ANCORA_PDF_PAGES.map((p) => (
                <div
                  key={p.pageNumber}
                  className="rounded-xl p-2 bg-slate-900/80 border border-slate-700/70 backdrop-blur-sm text-center"
                >
                  <div className="text-[10px] font-mono font-black text-amber-400 uppercase">Page {p.pageNumber}</div>
                  <div className="text-[9px] text-slate-300 font-bold truncate mt-0.5">{p.title.split(',')[0]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Launch / Enter Button */}
          <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => {
                setHasStarted(true);
                tts.speak('Opening Ancora Master Pre-Trip PDF Lightbox. Page 1: Pre-Inspection, Engine Bay, and Front Axle.');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-2xl shadow-amber-500/40 transition active:scale-95 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <BookOpen className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>Launch Lightbox PDF Viewer</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <span className="text-xs text-slate-400 font-mono">
              ⚡ Touch-friendly swipe • Yard-ready contrast • Audio recitation enabled
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // BADASS LIGHTBOX SWIPEABLE VIEWER
  // ========================================================
  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`w-full rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-200 border flex flex-col ${
        outdoorMode
          ? 'bg-white border-2 sm:border-4 border-slate-950 text-slate-950 shadow-xl'
          : 'bg-slate-950 border-slate-800 text-slate-100 shadow-2xl'
      } ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen'
          : 'relative'
      }`}
    >
      {/* ================= COMPACT TOP CONTROLS ================= */}
      <div
        className={`relative z-10 flex-shrink-0 border-b backdrop-blur-xl ${
          outdoorMode ? 'bg-slate-100/95 border-slate-300' : 'bg-slate-900/95 border-slate-800'
        }`}
        style={{
          paddingTop: isFullscreen
            ? 'var(--header-safe-top, max(env(safe-area-inset-top, 0px), 0.75rem))'
            : undefined,
        }}
      >
        {/* Tier 1: Breadcrumb Title & Action Tools (Single Line - No Wrap) */}
        <div className="px-3 sm:px-6 py-2 flex items-center justify-between gap-2 border-b border-slate-800/40">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-1 sm:gap-2 text-xs font-semibold min-w-0">
            <button
              onClick={() => setHasStarted(false)}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg transition font-mono font-bold uppercase text-[11px] flex-shrink-0 cursor-pointer active:scale-95 ${
                outdoorMode
                  ? 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Return to Cover Page"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Cover</span>
            </button>

            <span className="text-slate-500 font-bold text-xs">/</span>

            <span className="text-[11px] sm:text-xs font-mono uppercase text-sky-400 font-bold truncate max-w-[100px] xs:max-w-none">
              Ancora PDF
            </span>

            <span className="text-slate-500 font-bold text-xs">/</span>

            <div
              className={`px-1.5 sm:px-2 py-0.5 rounded-md font-mono text-[10px] sm:text-[11px] font-black uppercase whitespace-nowrap flex-shrink-0 ${
                outdoorMode ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              Page {currentPage}/{totalPages}
            </div>
          </div>

          {/* Super Menu Utility Tools (Compact Icon Buttons - Never Wraps) */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Read Aloud Voice Button */}
            <button
              onClick={handleReadAloud}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold transition active:scale-95 flex items-center gap-1 border cursor-pointer ${
                isReadingAloud
                  ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                  : outdoorMode
                  ? 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title={isReadingAloud ? 'Pause Voice Recitation' : 'Read Page Scripts Aloud'}
            >
              {isReadingAloud ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
              <span className="hidden md:inline">{isReadingAloud ? 'Stop' : 'Listen'}</span>
            </button>

            {/* Copy Script Text */}
            <button
              onClick={handleCopyText}
              className={`p-1.5 rounded-lg text-xs font-bold transition active:scale-95 border cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : outdoorMode
                  ? 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title="Copy Page Scripts to Clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
            </button>

            {/* Print PDF Sheet */}
            <button
              onClick={handlePrint}
              className={`p-1.5 rounded-lg text-xs font-bold transition active:scale-95 border cursor-pointer ${
                outdoorMode
                  ? 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title="Print Current Page / Save to PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {/* Toggle Fullscreen Lightbox */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-1.5 rounded-lg text-xs font-bold transition active:scale-95 border cursor-pointer ${
                outdoorMode
                  ? 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand to Fullscreen Lightbox'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Tier 2: Page Stepper / Thumbnail Tracker */}
        <div
          className={`px-2 sm:px-6 py-1.5 sm:py-2 overflow-x-auto flex items-center justify-between gap-1.5 sm:gap-2 scrollbar-none ${
            outdoorMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0 overflow-x-auto scrollbar-none py-0.5">
            {ANCORA_PDF_PAGES.map((page) => {
              const isActive = page.pageNumber === currentPage;
              return (
                <button
                  key={page.pageNumber}
                  onClick={() => setCurrentPage(page.pageNumber)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                    isActive
                      ? outdoorMode
                        ? 'bg-blue-700 text-white shadow-md'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                      : outdoorMode
                      ? 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span>P.{page.pageNumber}</span>
                  <span className="hidden md:inline text-[11px] font-normal truncate max-w-[110px]">
                    {page.title.split(',')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Prev / Next Arrow Steppers */}
          <div className="flex items-center gap-1 flex-shrink-0 pl-1">
            <button
              onClick={goToPrev}
              disabled={currentPage === 1}
              className={`p-1 sm:p-1.5 rounded-lg border transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                outdoorMode
                  ? 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <span className="font-mono text-[11px] sm:text-xs font-black px-1 text-slate-300">
              {currentPage}/{totalPages}
            </span>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className={`p-1 sm:p-1.5 rounded-lg border transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                outdoorMode
                  ? 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN LIGHTBOX BODY ================= */}
      <div ref={contentBodyRef} className="p-3 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6">
        {/* Page Title & Vehicle Range Banner */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30 max-w-full">
                {activePage.sectionsCovered}
              </span>
              <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Ancora Master Script</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight break-words">
              Page {activePage.pageNumber}: {activePage.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              {activePage.subtitle}
            </p>
          </div>

          {/* Quick Search on this page */}
          <div className="relative w-full sm:w-64 flex-shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scripts on page..."
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none transition border ${
                outdoorMode
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                  : 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Two-Column Master Display: Key Highlights & Verbatim Document Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Key Spoken Scripts & Ancora Rules (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Range Rule Alert */}
            <div
              className={`p-4 rounded-2xl border ${
                outdoorMode
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Critical Range Rule</span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                Always physically go, point at, and touch every single element of the exterior and in-cab inspection! Spoken scripts that you must say out loud are highlighted below.
              </p>
            </div>

            {/* Spoken Script Callouts */}
            <div
              className={`p-4 rounded-2xl border ${
                outdoorMode ? 'bg-slate-50 border-slate-300' : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <h3 className="text-xs font-black uppercase tracking-wider text-sky-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Must-Say Verbatim Scripts (Page {activePage.pageNumber}):
              </h3>

              <div className="space-y-2.5">
                {filteredHighlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs leading-relaxed transition ${
                      hl.includes('SCRIPT') || hl.includes('"')
                        ? outdoorMode
                          ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold'
                          : 'bg-blue-950/40 border-blue-500/50 text-blue-200 font-semibold'
                        : outdoorMode
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                      <span>{hl}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Hint */}
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/70 text-[11px] text-slate-400 flex items-center justify-between">
              <span>👉 Swipe left/right on screen to turn pages</span>
              <span className="font-mono text-amber-400 font-bold">Page {currentPage} of 6</span>
            </div>
          </div>

          {/* Right Column: Verbatim PDF Document Replica Sheet (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div
              className={`rounded-2xl p-5 sm:p-7 border font-mono text-xs shadow-inner overflow-x-auto relative ${
                outdoorMode
                  ? 'bg-white border-2 border-slate-400 text-slate-900'
                  : 'bg-[#0b101c] border-slate-800 text-slate-200'
              }`}
            >
              {/* Document Stamp Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="font-bold uppercase tracking-wider text-[11px] text-sky-400">
                    Ancora PTI Master Guide Document • Revised 2026
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">
                  Official Ancora Sheet P.{activePage.pageNumber}
                </span>
              </div>

              {/* Verbatim Document Text with Custom Styling */}
              <pre className="whitespace-pre-wrap font-mono text-[11px] sm:text-xs leading-relaxed text-inherit select-text">
                {activePage.pdfExcerpt}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM LIGHTBOX FOOTER CONTROLS ================= */}
      <div
        className={`px-3 sm:px-6 py-2.5 sm:py-3 border-t flex-shrink-0 flex items-center justify-between gap-2 select-none w-full ${
          outdoorMode ? 'bg-slate-100 border-slate-300' : 'bg-slate-900/95 border-slate-800'
        }`}
        style={{
          paddingLeft: 'max(0.75rem, env(safe-area-inset-left, 0px))',
          paddingRight: 'max(0.75rem, env(safe-area-inset-right, 0px))',
        }}
      >
        {/* Previous Page Button */}
        <button
          onClick={goToPrev}
          disabled={currentPage === 1}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 border flex items-center gap-1.5 flex-shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
            outdoorMode
              ? 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'
              : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4 flex-shrink-0" />
          <span>Prev<span className="hidden sm:inline">ious</span></span>
        </button>

        {/* Center Page Indicator & Swipe Hint */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 text-center min-w-0 px-1">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-400">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 font-black">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 hidden xs:inline uppercase tracking-tight truncate">
            Swipe or Arrows
          </span>
        </div>

        {/* Next Page Button - NEVER CUT OFF */}
        <button
          onClick={goToNext}
          disabled={currentPage === totalPages}
          className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5 flex-shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
            outdoorMode
              ? 'bg-blue-700 text-white shadow-md hover:bg-blue-800'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500'
          }`}
          title="Next Page"
        >
          <span>Next<span className="hidden sm:inline"> Page</span></span>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
};

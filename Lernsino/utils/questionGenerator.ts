
import { Question, LevelType, Flashcard } from '../types';

// Helper for random integers
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const fmt = (n: number) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

// --- STATIC QUESTION DATABASE FOR SPECIFIC UNITS ---
// Contains all Accounting Levels 1-8 + Boss Fight

const STATIC_QUESTIONS: Record<string, Question[]> = {
  // ⭐ LEVEL 1 – Grundlagen GoB (Basics)
  'acc_1_1': [
    {
      id: 'acc_1_1_q1',
      text: 'Was ist der Hauptzweck der Bilanzierung?',
      options: ['Dokumentation & Information für Gläubiger/Eigner', 'Maximierung der Steuerlast', 'Berechnung der Mitarbeiterzufriedenheit', 'Erstellung von Marketingplänen'],
      correctIndex: 0,
      explanation: 'Die Bilanzierung dient primär der Dokumentation von Geschäftsvorfällen und der Information von Adressaten (Gläubiger, Staat, Eigner).'
    },
    {
      id: 'acc_1_1_q2',
      text: 'Welche Bestandteile gehören zwingend zum Jahresabschluss einer großen Kapitalgesellschaft?',
      options: ['Bilanz, GuV, Anhang, Lagebericht', 'Nur Bilanz & GuV', 'Bilanz, Steuererklärung, Handelsregisterauszug', 'GuV und Inventarliste'],
      correctIndex: 0,
      explanation: 'Kapitalgesellschaften müssen Bilanz, GuV und Anhang aufstellen. Der Lagebericht ist zwar eng verbunden, gehört aber streng genommen nicht zum JA, sondern ist ein eigenständiger Bericht.'
    },
    {
      id: 'acc_1_1_q3',
      text: 'Wer stellt den Jahresabschluss auf?',
      options: ['Der Vorstand / die Geschäftsführung', 'Der Aufsichtsrat', 'Die Hauptversammlung', 'Der Abschlussprüfer'],
      correctIndex: 0,
      explanation: 'Die gesetzlichen Vertreter (Geschäftsführung/Vorstand) sind für die Aufstellung verantwortlich.'
    },
    {
      id: 'acc_1_1_q4',
      text: 'Was bedeutet "Feststellung" des Jahresabschlusses?',
      options: ['Der Abschluss wird verbindlich "genehmigt"', 'Der Abschluss wird geschrieben', 'Der Prüfer unterschreibt', 'Das Finanzamt akzeptiert ihn'],
      correctIndex: 0,
      explanation: 'Die Feststellung ist der formale Akt, mit dem der Jahresabschluss verbindlich wird.'
    },
    {
      id: 'acc_1_1_q5',
      text: 'Was ist KEIN typischer Adressat des Jahresabschlusses?',
      options: ['Die Hausmeister', 'Das Finanzamt', 'Banken (Gläubiger)', 'Aktionäre'],
      correctIndex: 0,
      explanation: 'Interne Dienstleister sind keine primären Adressaten der externen Rechnungslegung.'
    }
  ],

  'acc_1_2': [
    {
      id: 'acc_1_2_q1',
      text: 'Was ist der Unterschied zwischen Inventur und Inventar?',
      options: ['Inventur ist die Tätigkeit (Zählen), Inventar ist das Ergebnis (Liste)', 'Inventar ist das Zählen, Inventur die Liste', 'Beides ist das Gleiche', 'Inventur ist für Anlagevermögen, Inventar für Umlaufvermögen'],
      correctIndex: 0,
      explanation: 'Inventur = Tätigkeit (Bestandsaufnahme). Inventar = Das Bestandsverzeichnis.'
    },
    {
      id: 'acc_1_2_q2',
      text: 'Welches Prinzip gilt bei der körperlichen Bestandsaufnahme (Inventur) oft zur Sicherheit?',
      options: ['Vier-Augen-Prinzip', 'Ein-Mann-Methode', 'Schätz-Prinzip', 'Schnelligkeits-Prinzip'],
      correctIndex: 0,
      explanation: 'Beim Vier-Augen-Prinzip prüfen zwei Personen unabhängig voneinander, um Fehler/Manipulation zu vermeiden.'
    },
    {
      id: 'acc_1_2_q3',
      text: 'Was geht aus dem Inventar in die Bilanz über?',
      options: ['Das Reinvermögen (Eigenkapital) als Saldo', 'Jeder einzelne Kugelschreiber', 'Nur die Schulden', 'Nichts, die Bilanz ist unabhängig'],
      correctIndex: 0,
      explanation: 'Die Bilanz ist eine kurzgefasste Gegenüberstellung. Das Inventar ist die detaillierte Basis. Das Reinvermögen wird als EK übernommen.'
    },
    {
      id: 'acc_1_2_q4',
      text: 'Warum darf man bei der Inventur nicht einfach den Buchwert abschreiben?',
      options: ['Weil Soll- und Ist-Bestände abweichen können (Diebstahl, Schwund)', 'Weil es zu einfach wäre', 'Weil der Computer lügen könnte', 'Darf man, wenn man faul ist'],
      correctIndex: 0,
      explanation: 'Die Inventur dient gerade dazu, den tatsächlichen Ist-Bestand zu prüfen und die Buchführung zu korrigieren.'
    },
    {
      id: 'acc_1_2_q5',
      text: 'Was ist eine "Stichprobeninventur"?',
      options: ['Hochrechnung des Bestandes basierend auf repräsentativen Stichproben', 'Man zählt nur die teuren Sachen', 'Man zählt an einem Tag alles', 'Eine Inventur mit Nadeln'],
      correctIndex: 0,
      explanation: 'Erlaubtes Verfahren: Mit mathematisch-statistischen Methoden wird vom Teil auf das Ganze geschlossen.'
    }
  ],

  'acc_1_3': [
    {
      id: 'acc_1_3_q1',
      text: 'Was besagt das Imparitätsprinzip?',
      options: ['Verluste müssen antizipiert werden, Gewinne erst bei Realisation', 'Gewinne und Verluste werden gleich behandelt', 'Immer den höchsten Wert ansetzen', 'Nur Bargeld zählt'],
      correctIndex: 0,
      explanation: 'Ungleichbehandlung (Imparität): Drohende Verluste müssen schon bilanziert werden, bevor sie eintreten. Gewinne erst, wenn sie sicher sind.'
    },
    {
      id: 'acc_1_3_q2',
      text: 'Was unterscheidet "Ansatz" von "Bewertung"?',
      options: ['Ansatz = "Kommt es in die Bilanz?", Bewertung = "Mit welchem Betrag?"', 'Ansatz = Aktiva, Bewertung = Passiva', 'Ansatz ist Steuerrecht, Bewertung ist HGB', 'Kein Unterschied'],
      correctIndex: 0,
      explanation: 'Ansatz dem Grunde nach (Ob?), Bewertung der Höhe nach (Wieviel?).'
    },
    {
      id: 'acc_1_3_q3',
      text: 'Ist reiner Forschungsaufwand aktivierungsfähig (bilanzierbar)?',
      options: ['Nein, Verbot nach HGB', 'Ja, Wahlrecht', 'Ja, Pflicht', 'Nur bei Patenten'],
      correctIndex: 0,
      explanation: 'Forschungskosten dürfen nach § 255 HGB nicht aktiviert werden. Nur Entwicklungskosten (Wahlrecht).'
    },
    {
      id: 'acc_1_3_q4',
      text: 'Was besagt das Periodisierungsprinzip?',
      options: ['Aufwendungen/Erträge sind dem Jahr zuzurechnen, in dem sie wirtschaftlich entstehen', 'Immer wenn das Geld fließt', 'Man darf sich die Periode aussuchen', 'Nur alle 10 Jahre bilanzieren'],
      correctIndex: 0,
      explanation: 'Zahlungszeitpunkt ist irrelevant. Wichtig ist die wirtschaftliche Zugehörigkeit (Verursachung).'
    },
    {
      id: 'acc_1_3_q5',
      text: 'Was versteht man unter "Bilanzidentität"?',
      options: ['Schlussbilanz des Vorjahres muss mit Eröffnungsbilanz des neuen Jahres identisch sein', 'Die Bilanz muss jedes Jahr gleich aussehen', 'Aktiva und Passiva sind identisch', 'Identität des Buchhalters'],
      correctIndex: 0,
      explanation: 'Die Werte dürfen beim Jahreswechsel nicht verändert werden (§ 252 HGB).'
    }
  ],

  'acc_1_4': [
    {
      id: 'acc_1_4_q1',
      text: 'Was ist das oberste Ziel des Vorsichtsprinzips?',
      options: ['Gläubigerschutz (Unternehmen nicht reicher rechnen als es ist)', 'Steuermaximierung', 'Aktionäre glücklich machen', 'Einfachheit'],
      correctIndex: 0,
      explanation: 'Man rechnet sich im Zweifel ärmer, damit kein Scheingewinn ausgeschüttet wird, der den Gläubigern dann fehlt.'
    },
    {
      id: 'acc_1_4_q2',
      text: 'Wann gilt ein Gewinn als "realisiert" (Realisationsprinzip)?',
      options: ['Bei Gefahrenübergang (Lieferung/Leistung erbracht)', 'Bei Vertragsunterschrift', 'Bei Geldeingang', 'Wenn man ein gutes Gefühl hat'],
      correctIndex: 0,
      explanation: 'Gewinne sind realisiert, wenn die Leistung erbracht ist und das Risiko auf den Käufer übergegangen ist.'
    },
    {
      id: 'acc_1_4_q3',
      text: 'Was sind "Schwebende Geschäfte"?',
      options: ['Verträge, bei denen Leistung & Gegenleistung noch ausstehen', 'Geschäfte im Flugzeug', 'Abgeschlossene Geschäfte ohne Zahlung', 'Illegale Geschäfte'],
      correctIndex: 0,
      explanation: 'Ein Vertrag ist geschlossen, aber noch hat keiner "geliefert". Hier drohen Risiken (Drohverlustrückstellung).'
    },
    {
      id: 'acc_1_4_q4',
      text: 'Darf man unrealisierte Gewinne (z.B. Wertsteigerung Grundstück) bilanzieren?',
      options: ['Nein, Anschaffungskostenprinzip (Obergrenze)', 'Ja, zum Marktwert', 'Ja, wenn man will', 'Nur bei Aktien'],
      correctIndex: 0,
      explanation: 'Nein. Anschaffungskosten sind die Obergrenze. Wertsteigerungen werden erst beim Verkauf realisiert.'
    }
  ],

  // ⭐ LEVEL 2 – Ansatz & Bewertung
  'acc_2_1': [ // Periodisierung
    {
      id: 'acc_2_1_q1',
      text: 'Wofür steht ARAP?',
      options: ['Aktiver Rechnungsabgrenzungsposten', 'Allgemeine Rechnungsabgrenzung', 'Aktive Rückstellungsposition', 'Aufwand Rückstellung Aktiva'],
      correctIndex: 0,
      explanation: 'Ausgabe jetzt, Aufwand später (im neuen Jahr).'
    },
    {
      id: 'acc_2_1_q2',
      text: 'Miete für Januar wird schon im Dezember bezahlt. Wie bucht der Mieter im Dezember?',
      options: ['ARAP an Bank', 'Mietaufwand an Bank', 'Bank an Erträge', 'PRAP an Bank'],
      correctIndex: 0,
      explanation: 'Die Ausgabe ist im alten Jahr, der Aufwand gehört wirtschaftlich ins neue Jahr -> ARAP.'
    },
    {
      id: 'acc_2_1_q3',
      text: 'Was kennzeichnet einen PRAP (Passiver RA-Posten)?',
      options: ['Einnahme jetzt, Ertrag später', 'Ausgabe jetzt, Aufwand später', 'Einnahme später, Ertrag jetzt', 'Rückstellung für Pensionen'],
      correctIndex: 0,
      explanation: 'Man hat Geld erhalten (Einnahme vor Bilanzstichtag), aber die Leistung erfolgt erst im neuen Jahr (Ertrag nach Stichtag).'
    },
    {
      id: 'acc_2_1_q4',
      text: 'Was ist ein typisches "Sonstiges Vermögen" im Sinne der Abgrenzung?',
      options: ['Forderung (Ertrag jetzt, Einnahme später)', 'ARAP', 'Rückstellung', 'Verbindlichkeit'],
      correctIndex: 0,
      explanation: 'Wenn die Leistung schon erbracht wurde (Ertrag), aber das Geld noch fehlt, entsteht eine Forderung ("Sonstiges Vermögen").'
    },
    {
      id: 'acc_2_1_q5',
      text: 'Dürfen Rechnungsabgrenzungsposten weggelassen werden?',
      options: ['Nein, Pflicht zur periodengerechten Gewinnermittlung', 'Ja, bei kleinen Beträgen', 'Ja, Wahlrecht', 'Nur im Steuerrecht'],
      correctIndex: 0,
      explanation: 'Nach GoB (Periodisierungsprinzip) ist die Abgrenzung zwingend erforderlich.'
    }
  ],
  'acc_2_2': [ // AK vs HK
    {
      id: 'acc_2_2_q1',
      text: 'Was gehört NICHT zu den Anschaffungskosten (AK)?',
      options: ['Umsatzsteuer (sofern Vorsteuerabzug möglich)', 'Anschaffungsnebenkosten (Transport)', 'Anschaffungspreis', 'Nachträgliche Anschaffungskosten'],
      correctIndex: 0,
      explanation: 'Die abziehbare Vorsteuer ist ein Durchlaufposten und gehört nicht zu den AK.'
    },
    {
      id: 'acc_2_2_q2',
      text: 'Wie wirken sich Skonti auf die Anschaffungskosten aus?',
      options: ['Sie mindern die AK (Anschaffungspreisminderungen)', 'Sie erhöhen die AK', 'Sie sind Zinserträge', 'Sie sind irrelevant'],
      correctIndex: 0,
      explanation: 'Rabatte, Skonti und Boni mindern den Wert des Wirtschaftsguts (§ 255 Abs. 1 HGB).'
    },
    {
      id: 'acc_2_2_q3',
      text: 'Was sind Herstellkosten (HK)?',
      options: ['Aufwendungen, die durch den Verbrauch von Gütern/Diensten für die Herstellung entstehen', 'Der Preis im Laden', 'Nur die Materialkosten', 'Transportkosten vom Lieferanten'],
      correctIndex: 0,
      explanation: 'HK umfassen Materialkosten, Fertigungskosten und Sonderkosten der Fertigung (§ 255 Abs. 2 HGB).'
    },
    {
      id: 'acc_2_2_q4',
      text: 'Sind Verwaltungsgemeinkosten in die Herstellkosten einbeziehbar?',
      options: ['Ja, es besteht ein Wahlrecht (Handelsrecht)', 'Nein, striktes Verbot', 'Ja, Pflicht', 'Nur bei immateriellen VG'],
      correctIndex: 0,
      explanation: 'Nach HGB besteht ein Wahlrecht zur Einbeziehung von angemessenen Verwaltungsgemeinkosten.'
    },
    {
      id: 'acc_2_2_q5',
      text: 'Was ist ein "Aktivierungserfolg"?',
      options: ['Buchung: Unfertige Erzeugnisse an Bestandsveränderung (Ertrag)', 'Ein Erfolg beim Sport', 'Wenn man Aktien kauft', 'Gewinn aus Verkauf'],
      correctIndex: 0,
      explanation: 'Durch die Aktivierung selbsterstellter Anlagen oder Vorräte entsteht ein Ertrag (Bestandsveränderung/andere aktivierte Eigenleistungen), der den Aufwand neutralisiert.'
    }
  ],
  'acc_2_3': [ // Abschreibungen
    {
      id: 'acc_2_3_q1',
      text: 'Warum schreibt man Anlagevermögen planmäßig ab?',
      options: ['Um den Wertverzehr über die Nutzungsdauer abzubilden', 'Um Steuern zu sparen', 'Weil es kaputt geht', 'Damit die Bilanz leerer wird'],
      correctIndex: 0,
      explanation: 'Die Anschaffungskosten werden auf die Jahre der Nutzung verteilt (Periodisierung).'
    },
    {
      id: 'acc_2_3_q2',
      text: 'Wird Umlaufvermögen (z.B. Vorräte) planmäßig abgeschrieben?',
      options: ['Nein, nur außerplanmäßig (bei Wertverlust)', 'Ja, immer', 'Ja, über 5 Jahre', 'Nur Forderungen'],
      correctIndex: 0,
      explanation: 'Umlaufvermögen soll nicht dauerhaft bleiben, daher gibt es keine "Nutzungsdauer" und keine planmäßige AfA.'
    },
    {
      id: 'acc_2_3_q3',
      text: 'Wann MUSS außerplanmäßig abgeschrieben werden (Anlagevermögen)?',
      options: ['Bei voraussichtlich dauernder Wertminderung', 'Bei vorübergehender Wertschwankung', 'Wenn der Gewinn zu hoch ist', 'Nie'],
      correctIndex: 0,
      explanation: 'Nach dem gemilderten Niederstwertprinzip ist bei dauernder Wertminderung eine Abschreibung zwingend.'
    },
    {
      id: 'acc_2_3_q4',
      text: 'Eine Maschine explodiert und ist wertlos. Was tun?',
      options: ['Vollabschreibung (Außerplanmäßige AfA auf den Erinnerungswert oder 0)', 'Nichts, steht ja im Buch', 'Reparatur buchen', 'Als Abgang zum Neupreis buchen'],
      correctIndex: 0,
      explanation: 'Der Restbuchwert wird sofort außerplanmäßig abgeschrieben.'
    },
    {
      id: 'acc_2_3_q5',
      text: 'Was ist das "strenge Niederstwertprinzip"?',
      options: ['Gilt für Umlaufvermögen: Man muss immer auf den niedrigeren Wert abschreiben (auch bei nur vorübergehender Minderung)', 'Gilt für Anlagevermögen', 'Man darf nie abschreiben', 'Gilt nur für Geld'],
      correctIndex: 0,
      explanation: 'Im UV muss immer der niedrigste Wert aus AK/HK und Marktpreis angesetzt werden (keine Wahlrechte bei Wertminderung).'
    }
  ],

  // ⭐ LEVEL 3 – Immaterielle Vermögenswerte
  'acc_3_1': [
    {
      id: 'acc_3_1_q1',
      text: 'Darf man selbst geschaffene immaterielle Vermögensgegenstände des Anlagevermögens (z.B. Software) aktivieren?',
      options: ['Ja, es besteht ein Wahlrecht im HGB', 'Nein, striktes Verbot', 'Ja, Pflicht', 'Nur wenn man sie verkauft'],
      correctIndex: 0,
      explanation: 'Nach § 248 Abs. 2 HGB darf man sie aktivieren (Wahlrecht), muss aber nicht.'
    },
    {
      id: 'acc_3_1_q2',
      text: 'Welche selbst geschaffenen immateriellen VG dürfen NIEMALS aktiviert werden?',
      options: ['Marken, Drucktitel, Verlagsrechte, Kundenlisten', 'Software', 'Patente', 'Lizenzen'],
      correctIndex: 0,
      explanation: 'Hier greift das Aktivierungsverbot (§ 248 Abs. 2 Satz 2 HGB), da der Wert schwer objektivierbar ist.'
    },
    {
      id: 'acc_3_1_q3',
      text: 'Wie werden entgeltlich erworbene immaterielle VG behandelt?',
      options: ['Aktivierungspflicht', 'Aktivierungswahlrecht', 'Aktivierungsverbot', 'Passivierung'],
      correctIndex: 0,
      explanation: 'Wenn man dafür bezahlt hat (Kauf), muss man sie aktivieren (Derivative Acquisition).'
    },
    {
      id: 'acc_3_1_q4',
      text: 'Was ist das Problem bei der Aktivierung selbst geschaffener VG?',
      options: ['Ausschüttungssperre (Gewinn darf nicht ausgeschüttet werden, um Gläubiger zu schützen)', 'Man zahlt zu wenig Steuern', 'Die Bilanz wird zu kurz', 'Es ist illegal'],
      correctIndex: 0,
      explanation: 'Werden sie aktiviert, sind die entsprechenden Beträge für die Ausschüttung gesperrt (§ 268 Abs. 8 HGB).'
    },
    {
      id: 'acc_3_1_q5',
      text: 'Unterschied HGB vs Steuerrecht bei selbst geschaffenen immateriellen VG?',
      options: ['HGB: Wahlrecht / Steuerrecht: Verbot', 'HGB: Verbot / Steuerrecht: Pflicht', 'Beide gleich', 'Steuerrecht: Wahlrecht'],
      correctIndex: 0,
      explanation: 'Steuerrechtlich dürfen selbst geschaffene immaterielle WG des AV nicht aktiviert werden (Maßgeblichkeitsdurchbrechung).'
    }
  ],
  'acc_3_2': [ // Entwicklungskosten
    {
      id: 'acc_3_2_q1',
      text: 'Ein Pharma-Unternehmen hat 100k Forschungskosten und 30k Entwicklungskosten. Was darf in die Bilanz?',
      options: ['Maximal 30.000 €', '130.000 €', '0 €', '100.000 €'],
      correctIndex: 0,
      explanation: 'Forschungskosten = Aktivierungsverbot. Entwicklungskosten = Wahlrecht.'
    },
    {
      id: 'acc_3_2_q2',
      text: 'Was passiert, wenn Forschung und Entwicklung nicht verlässlich getrennt werden können?',
      options: ['Alles ist Verbot (keine Aktivierung)', 'Alles darf aktiviert werden', 'Man darf schätzen (50/50)', 'Wahlrecht'],
      correctIndex: 0,
      explanation: 'Ist eine Trennung nicht möglich, gilt das Vorsichtsprinzip: Aktivierungsverbot für den gesamten Betrag.'
    },
    {
      id: 'acc_3_2_q3',
      text: 'Wie beeinflusst die Aktivierung von Entwicklungskosten den Gewinn im ersten Jahr?',
      options: ['Der Gewinn steigt (Aufwand wird neutralisiert)', 'Der Gewinn sinkt', 'Keine Auswirkung', 'Der Umsatz steigt'],
      correctIndex: 0,
      explanation: 'Statt "Aufwand an Bank" bucht man "Anlagevermögen an Ertrag (aktivierte Eigenleistung)". Der Aufwand wird neutralisiert, der Gewinn ist höher als ohne Aktivierung.'
    },
    {
      id: 'acc_3_2_q4',
      text: 'Was bedeutet Bewertungsstetigkeit hier?',
      options: ['Wenn man einmal aktiviert, muss man bei diesem VG dabei bleiben', 'Man muss jedes Jahr neu würfeln', 'Man muss immer den gleichen Betrag nehmen', 'Gilt nicht für Entwicklung'],
      correctIndex: 0,
      explanation: 'Die gewählte Methode (Aktivierung oder Aufwand) muss für das Projekt beibehalten werden.'
    },
    {
      id: 'acc_3_2_q5',
      text: 'Welche Folge hat die Aktivierung auf latente Steuern?',
      options: ['Es entstehen passive latente Steuern', 'Es entstehen aktive latente Steuern', 'Keine Auswirkung', 'Steuern sinken sofort'],
      correctIndex: 0,
      explanation: 'Handelsbilanz (Aktiv) > Steuerbilanz (0, da Verbot). Man ist im HGB "reicher". Die Steuerzahlung kommt später -> Passive latente Steuern (Rückstellung für Steuerlast).'
    }
  ],

  // ⭐ LEVEL 4 – Firmenwert (GoF)
  'acc_4_1': [ // Ansatz GoF
    {
      id: 'acc_4_1_q1',
      text: 'Wie entsteht ein derivativer Firmenwert (Goodwill)?',
      options: ['Kaufpreis > Zeitwert des Nettovermögens (EK)', 'Kaufpreis < Nettovermögen', 'Durch gute Werbung', 'Durch Mitarbeitermotivation'],
      correctIndex: 0,
      explanation: 'Wenn man eine Firma kauft und mehr bezahlt, als die Substanz wert ist (für Kundenstamm, Ruf, Synergien).'
    },
    {
      id: 'acc_4_1_q2',
      text: 'Darf ein originärer (selbst geschaffener) Firmenwert aktiviert werden?',
      options: ['Nein, absolutes Verbot', 'Ja, Wahlrecht', 'Ja, Pflicht', 'Nur bei AGs'],
      correctIndex: 0,
      explanation: 'Nein. Man kann sich seinen eigenen guten Ruf nicht in die Bilanz schreiben (nicht objektivierbar).'
    },
    {
      id: 'acc_4_1_q3',
      text: 'Was ist das Nettovermögen bei der GoF-Berechnung?',
      options: ['Vermögen (Zeitwert) minus Schulden (Zeitwert)', 'Summe aller Assets', 'Das Grundkapital', 'Der Gewinn'],
      correctIndex: 0,
      explanation: 'Assets at Fair Value minus Liabilities at Fair Value.'
    },
    {
      id: 'acc_4_1_q4',
      text: 'Kaufpreis 1 Mio. Vermögen 800k, Schulden 200k. Wie hoch ist der GoF?',
      options: ['400.000 €', '200.000 €', '600.000 €', '0 €'],
      correctIndex: 0,
      explanation: 'Nettovermögen = 800k - 200k = 600k. Kaufpreis 1 Mio - 600k = 400k GoF.'
    },
    {
      id: 'acc_4_1_q5',
      text: 'Wo steht der Geschäfts- oder Firmenwert in der Bilanz?',
      options: ['Anlagevermögen (Immaterielle VG)', 'Umlaufvermögen', 'Eigenkapital', 'Rechnungsabgrenzung'],
      correctIndex: 0,
      explanation: 'Er wird als immaterieller Vermögensgegenstand des Anlagevermögens ausgewiesen.'
    }
  ],
  'acc_4_2': [ // Folgebewertung
    {
      id: 'acc_4_2_q1',
      text: 'Wie wird der GoF im HGB planmäßig abgeschrieben?',
      options: ['Über die voraussichtliche Nutzungsdauer (typisch 10 Jahre)', 'Gar nicht (nur Impairment)', 'Über 50 Jahre', 'Sofort als Aufwand'],
      correctIndex: 0,
      explanation: 'HGB verlangt planmäßige Abschreibung. Kann die Dauer nicht geschätzt werden, gelten 10 Jahre (§ 253 Abs. 3 HGB).'
    },
    {
      id: 'acc_4_2_q2',
      text: 'Wie ist die Abschreibungsdauer im Steuerrecht für den GoF?',
      options: ['Pauschal 15 Jahre', '10 Jahre', '5 Jahre', 'Unbegrenzt'],
      correctIndex: 0,
      explanation: 'Steuerlich ist der Firmenwert zwingend über 15 Jahre abzuschreiben (§ 7 Abs. 1 EStG).'
    },
    {
      id: 'acc_4_2_q3',
      text: 'Kann ein abgeschriebener Firmenwert wieder zugeschrieben werden (Wertaufholung)?',
      options: ['Nein, Zuschreibungsverbot', 'Ja, bis zu den AK', 'Ja, unbegrenzt', 'Nur bei IFRS'],
      correctIndex: 0,
      explanation: 'Für den GoF gilt ein explizites Wertaufholungsverbot (§ 253 Abs. 5 Satz 2 HGB), auch wenn er wieder mehr wert ist.'
    },
    {
      id: 'acc_4_2_q4',
      text: 'Was passiert bei einem "Badwill" (Kaufpreis < Nettovermögen)?',
      options: ['Unterschiedsbetrag aus der Kapitalkonsolidierung (Passivseite)', 'Gewinn sofort buchen', 'Als GoF aktivieren', 'Ignorieren'],
      correctIndex: 0,
      explanation: 'Er wird passiviert ("Unterschiedsbetrag aus der Kapitalkonsolidierung") und später ertragswirksam aufgelöst.'
    },
    {
      id: 'acc_4_2_q5',
      text: 'Was verursacht die unterschiedliche Laufzeit (10 J HGB vs 15 J Steuer)?',
      options: ['Latente Steuern (temporäre Differenz)', 'Nichts', 'Steuerhinterziehung', 'Höheren Gewinn im Steuerrecht'],
      correctIndex: 0,
      explanation: 'Unterschiedliche Abschreibungsverläufe führen zu unterschiedlichen Buchwerten -> Latente Steuern.'
    }
  ],
  'acc_4_3': [ // Latente Steuern Basics
    {
      id: 'acc_4_3_q1',
      text: 'Wann entstehen aktive latente Steuern?',
      options: ['Wenn Handelsbilanz-Gewinn < Steuerbilanz-Gewinn (Wir zahlen jetzt zu viel Steuer, später weniger)', 'Wenn HB-Gewinn > StB-Gewinn', 'Wenn man Verlust macht', 'Nie'],
      correctIndex: 0,
      explanation: 'Aktive LSt sind wie eine Forderung an den Fiskus: Wir zahlen heute auf Basis der höheren StB, aber in Zukunft gleicht es sich aus.'
    },
    {
      id: 'acc_4_3_q2',
      text: 'Beispiel: Drohverlustrückstellung (HGB Pflicht, Steuer Verbot). Folge?',
      options: ['Aktive latente Steuern (HGB-Gewinn niedriger)', 'Passive latente Steuern', 'Keine latenten Steuern', 'Steuerfahndung'],
      correctIndex: 0,
      explanation: 'HGB bildet Aufwand (Gewinn runter). Steuer ignoriert Aufwand (Gewinn hoch). Wir zahlen heute Steuern auf einen Gewinn, den wir im HGB gar nicht haben -> Aktive LSt.'
    },
    {
      id: 'acc_4_3_q3',
      text: 'Darf man aktive latente Steuern bilanzieren?',
      options: ['Wahlrecht (§ 274 HGB)', 'Verbot', 'Pflicht', 'Nur bei GmbHs'],
      correctIndex: 0,
      explanation: 'Für den Aktivüberhang besteht ein Wahlrecht.'
    },
    {
      id: 'acc_4_3_q4',
      text: 'Muss man passive latente Steuern bilanzieren?',
      options: ['Ja, Passivierungspflicht', 'Nein, Wahlrecht', 'Nur bei AGs', 'Nein, Verbot'],
      correctIndex: 0,
      explanation: 'Für den Passivüberhang (Steuerschulden der Zukunft) besteht Passivierungspflicht (Rückstellungscharakter).'
    },
    {
      id: 'acc_4_3_q5',
      text: 'Womit werden latente Steuern bewertet?',
      options: ['Mit dem unternehmensindividuellen Steuersatz', 'Pauschal 15%', 'Pauschal 30%', 'Mit dem Umsatzsteuersatz'],
      correctIndex: 0,
      explanation: 'Man nimmt den Steuersatz, der voraussichtlich bei Abbau der Differenz gelten wird.'
    }
  ],

  // ⭐ LEVEL 5 – Vorräte & Bewertungsvereinfachung
  'acc_5_1': [
    {
      id: 'acc_5_1_q1',
      text: 'Was erlaubt die "Festbewertung" (Festwert)?',
      options: ['Ansetzung einer gleichbleibenden Menge zu gleichbleibenden Preisen (z.B. Geschirr im Hotel)', 'Man darf den Wert würfeln', 'Man nimmt immer den Marktpreis', 'Jedes Teil wird einzeln gezählt'],
      correctIndex: 0,
      explanation: 'Sinnvoll bei RHB oder Sachanlagen, die regelmäßig ersetzt werden und deren Bestand nur gering schwankt.'
    },
    {
      id: 'acc_5_1_q2',
      text: 'Was ist eine "Gruppenbewertung"?',
      options: ['Zusammenfassung gleichartiger Güter zu einem Durchschnittspreis', 'Bewertung nach Gruppenarbeit', 'Man bewertet nur Gruppenleiter', 'Zusammenfassung von Personal'],
      correctIndex: 0,
      explanation: 'Erleichterung: Statt jeden Nagel einzeln zu bewerten, bildet man den gewogenen Durchschnitt.'
    },
    {
      id: 'acc_5_1_q3',
      text: 'Welche Voraussetzung gilt für den Festwert?',
      options: ['Regelmäßiger Ersatz, nachrangige Bedeutung, Bestandsschwankungen gering', 'Hoher Wert der Güter', 'Darf nur alle 10 Jahre geprüft werden', 'Gilt nur für Autos'],
      correctIndex: 0,
      explanation: 'Es muss alle 3 Jahre eine körperliche Bestandsaufnahme erfolgen, um die Menge zu prüfen.'
    },
    {
      id: 'acc_5_1_q4',
      text: 'Welches Verfahren ist im HGB NICHT zulässig?',
      options: ['HIFO (Highest In - First Out)', 'LIFO', 'FIFO', 'Durchschnitt'],
      correctIndex: 0,
      explanation: 'Steuerlich und handelsrechtlich sind meist nur LIFO und FIFO (und Durchschnitt) relevant. HIFO ist i.d.R. nicht GoB-konform (Gewinnmanipulation).'
    },
    {
      id: 'acc_5_1_q5',
      text: 'Warum gibt es Bewertungsvereinfachungsverfahren?',
      options: ['Wirtschaftlichkeit (Kosten-Nutzen-Verhältnis der Rechnungslegung)', 'Weil Buchhalter faul sind', 'Um Steuern zu hinterziehen', 'Damit die Bilanz schöner aussieht'],
      correctIndex: 0,
      explanation: 'Jedes Schräubchen einzeln zu erfassen wäre zu teuer und bringt kaum Infowert.'
    }
  ],
  'acc_5_2': [ // FIFO LIFO
    {
      id: 'acc_5_2_q1',
      text: 'Wofür steht LIFO?',
      options: ['Last In - First Out', 'Last In - First Over', 'Lost In - Found Out', 'Low Interest - Finance Option'],
      correctIndex: 0,
      explanation: 'Die zuletzt gelieferten Güter werden zuerst verbraucht (typisch für Kieshaufen).'
    },
    {
      id: 'acc_5_2_q2',
      text: 'Was passiert bei LIFO in Zeiten steigender Preise?',
      options: ['Der Aufwand ist hoch (teure Ware verbraucht), der Endbestand niedrig (alte, billige Ware liegt noch)', 'Der Gewinn ist hoch', 'Der Bestand ist überbewertet', 'Steuern steigen'],
      correctIndex: 0,
      explanation: 'LIFO führt bei Inflation zu stillem Reserven (niedriger Lagerwert) und niedrigerem Gewinn (Steuervorteil).'
    },
    {
      id: 'acc_5_2_q3',
      text: 'Wofür steht FIFO?',
      options: ['First In - First Out', 'First In - First Over', 'Fast In - Fast Out', 'Fly In - Fly Out'],
      correctIndex: 0,
      explanation: 'Was zuerst kam, wird zuerst verbraucht (typisch für Milch/Verderbliches).'
    },
    {
      id: 'acc_5_2_q4',
      text: 'Darf man LIFO auch steuerlich nutzen?',
      options: ['Ja, § 6 Abs. 1 Nr. 2a EStG erlaubt LIFO', 'Nein, nur FIFO', 'Nein, nur Durchschnitt', 'Nur bei Kapitalgesellschaften'],
      correctIndex: 0,
      explanation: 'LIFO ist das einzige Verbrauchsfolgeverfahren, das steuerlich explizit anerkannt ist (neben Durchschnitt).'
    },
    {
      id: 'acc_5_2_q5',
      text: 'Welches Verfahren ist realitätsnäher für einen Supermarkt (Joghurt)?',
      options: ['FIFO (Ältestes muss zuerst raus)', 'LIFO', 'HIFO', 'LOFO'],
      correctIndex: 0,
      explanation: 'Physisch wird oft FIFO gemacht (Verfallsdatum). Die Bewertung darf davon abweichen, aber FIFO ist hier logisch.'
    }
  ],

  // ⭐ LEVEL 6 – Passivseite & Rückstellungen
  'acc_6_1': [ // Passivformen
    {
      id: 'acc_6_1_q1',
      text: 'Was unterscheidet Rückstellungen von Verbindlichkeiten?',
      options: ['Rückstellungen sind in Höhe und/oder Zeitpunkt ungewiss', 'Verbindlichkeiten sind ungewiss', 'Rückstellungen sind Eigenkapital', 'Verbindlichkeiten muss man nicht zurückzahlen'],
      correctIndex: 0,
      explanation: 'Beide sind Fremdkapital. Aber bei RSt weiß man noch nicht genau, wie viel oder wann man zahlen muss.'
    },
    {
      id: 'acc_6_1_q2',
      text: 'Warum stehen Rückstellungen zwischen EK und Verbindlichkeiten?',
      options: ['Sie sind Fremdkapital, aber mit Schätzcharakter', 'Sie sind eigentlich Eigenkapital', 'Das ist Zufall', 'Weil sie alphabetisch sortiert sind'],
      correctIndex: 0,
      explanation: 'Sie gehören zum FK, werden aber gesondert gezeigt wegen der Unsicherheit.'
    },
    {
      id: 'acc_6_1_q3',
      text: 'Was ist KEIN Grund für eine Rückstellung?',
      options: ['Zukünftige Investitionen (Anschaffung neuer Maschinen)', 'Drohende Verluste', 'Ungewisse Verbindlichkeiten (Prozesse)', 'Unterlassene Instandhaltung (Nachholung in 3 Monaten)'],
      correctIndex: 0,
      explanation: 'Rückstellungen für bloße zukünftige Investitionen sind verboten (Aufwandsrückstellungsverbot, § 249 Abs. 2 HGB a.F. gestrichen). Man spart aus dem Gewinn (Rücklagen), nicht als Aufwand.'
    },
    {
      id: 'acc_6_1_q4',
      text: 'Gehören Rücklagen zum Eigenkapital?',
      options: ['Ja (z.B. Gewinnrücklagen)', 'Nein, zum Fremdkapital', 'Nur gesetzliche Rücklagen', 'Nein, das sind Schulden'],
      correctIndex: 0,
      explanation: 'Rücklagen sind gespeicherte Gewinne (= Eigenkapital). Rückstellungen sind Schulden (= Fremdkapital).'
    },
    {
      id: 'acc_6_1_q5',
      text: 'Was sind "Instandhaltungsrückstellungen"?',
      options: ['Für Reparaturen, die im GJ unterlassen wurden, aber im 1. Quartal nachgeholt werden', 'Für künftige Reparaturen irgendwann', 'Für neue Maschinen', 'Für Putzmittel'],
      correctIndex: 0,
      explanation: '§ 249 HGB: Unterlassene Instandhaltung, die innerhalb von 3 Monaten nachgeholt wird.'
    }
  ],
  'acc_6_2': [ // Drohverlust
    {
      id: 'acc_6_2_q1',
      text: 'Was ist eine Drohverlustrückstellung?',
      options: ['Rückstellung für schwebende Geschäfte, bei denen der Wert der Leistung < Wert der Gegenleistung', 'Rückstellung für Diebstahl', 'Wenn der Chef droht', 'Verlustvortrag'],
      correctIndex: 0,
      explanation: 'Verpflichtung aus einem Vertrag > Wert, den ich erhalte. Die Differenz ist ein drohender Verlust.'
    },
    {
      id: 'acc_6_2_q2',
      text: 'Wie behandelt das Steuerrecht Drohverlustrückstellungen?',
      options: ['Passivierungsverbot (§ 5 Abs. 4a EStG)', 'Pflicht', 'Wahlrecht', 'Wie HGB'],
      correctIndex: 0,
      explanation: 'Steuerlich dürfen sie nicht gebildet werden (Fiskus will nicht an bloßen Erwartungen arm werden).'
    },
    {
      id: 'acc_6_2_q3',
      text: 'Welches GoB-Prinzip fordert die Drohverlustrückstellung im HGB?',
      options: ['Imparitätsprinzip', 'Realisationsprinzip', 'Anschaffungskostenprinzip', 'Stetigkeit'],
      correctIndex: 0,
      explanation: 'Verluste müssen antizipiert werden, auch wenn sie noch nicht realisiert sind.'
    },
    {
      id: 'acc_6_2_q4',
      text: 'Welche Folge hat das Verbot im Steuerrecht?',
      options: ['Aktive latente Steuern (HGB-Gewinn < Steuer-Gewinn)', 'Passive latente Steuern', 'Steuerrückzahlung', 'Nichts'],
      correctIndex: 0,
      explanation: 'Da der Aufwand steuerlich fehlt, ist der Steuergewinn höher als der Handelsgewinn. Wir zahlen "zu viel" Steuern -> Forderung (Aktive LSt).'
    },
    {
      id: 'acc_6_2_q5',
      text: 'Wo steht die Drohverlustrückstellung in der Bilanz?',
      options: ['Sonstige Rückstellungen', 'Steuerrückstellungen', 'Verbindlichkeiten', 'Pensionsrückstellungen'],
      correctIndex: 0,
      explanation: 'Sie fällt unter die sonstigen Rückstellungen.'
    }
  ],
  'acc_6_3': [ // Abzinsung
    {
      id: 'acc_6_3_q1',
      text: 'Müssen Rückstellungen abgezinst werden?',
      options: ['Ja, wenn Laufzeit > 1 Jahr (§ 253 Abs. 2 HGB)', 'Nein, nie', 'Nur bei Banken', 'Ja, immer mit 6%'],
      correctIndex: 0,
      explanation: 'Langfristige Rückstellungen müssen mit dem durchschnittlichen Marktzinssatz der letzten 7 (bzw. 10) Jahre abgezinst werden.'
    },
    {
      id: 'acc_6_3_q2',
      text: 'Warum zinst man ab?',
      options: ['Weil 100 € in 10 Jahren heute weniger wert sind (Zeitwert des Geldes)', 'Um den Gewinn zu erhöhen', 'Weil die Inflation kommt', 'Vorschrift der EU'],
      correctIndex: 0,
      explanation: 'Der Barwert einer künftigen Verpflichtung ist heute geringer.'
    },
    {
      id: 'acc_6_3_q3',
      text: 'Was passiert durch die Abzinsung mit dem Gewinn bei Bildung der RSt?',
      options: ['Der Aufwand ist geringer, Gewinn höher (als ohne Abzinsung)', 'Aufwand ist höher', 'Keine Auswirkung', 'Steuern steigen'],
      correctIndex: 0,
      explanation: 'Man passiviert nur den Barwert (kleinerer Betrag) statt Nennwert. Weniger Aufwand.'
    },
    {
      id: 'acc_6_3_q4',
      text: 'Was passiert in den Folgejahren ("Aufzinsung")?',
      options: ['Zinsaufwand (RSt wächst an)', 'Zinsertrag', 'Tilgung', 'Außerordentlicher Ertrag'],
      correctIndex: 0,
      explanation: 'Die RSt wächst jedes Jahr bis zum Erfüllungsbetrag an. Das ist Zinsaufwand.'
    },
    {
      id: 'acc_6_3_q5',
      text: 'Welcher Zinssatz wird genommen?',
      options: ['Rückstellungsabzinsungsverordnung (Bundesbank)', 'EZB Leitzins', 'Dispozins', '5% pauschal'],
      correctIndex: 0,
      explanation: 'Die Deutsche Bundesbank veröffentlicht monatlich die relevanten Zinssätze.'
    }
  ],
  'acc_6_4': [ // Prozessrückstellung (Rechtsstreit)
    {
      id: 'acc_6_4_q1',
      text: 'Wann muss eine Rückstellung für einen Prozess gebildet werden?',
      options: ['Wenn eine Inanspruchnahme wahrscheinlich ist (> 50%)', 'Wenn sie möglich ist', 'Wenn sie sicher ist', 'Nur wenn man verliert'],
      correctIndex: 0,
      explanation: 'Wahrscheinlichkeit > 50% ("mehr Gründe dafür als dagegen").'
    },
    {
      id: 'acc_6_4_q2',
      text: 'Was gehört in die Prozessrückstellung?',
      options: ['Erwartete Schadenszahlung + Gerichtskosten + Anwaltskosten', 'Nur die Strafe', 'Nur Anwaltskosten', 'Die Kaution'],
      correctIndex: 0,
      explanation: 'Alle Kosten, die mit der Verpflichtung zusammenhängen (Vollkosten).'
    },
    {
      id: 'acc_6_4_q3',
      text: 'Ein Kläger fordert 1 Mio. Wir schätzen Risiko auf 30%. Buchen?',
      options: ['Nein, nur Anhangsangabe (Eventualverbindlichkeit)', 'Ja, 300k RSt', 'Ja, 1 Mio RSt', 'Ja, 500k RSt'],
      correctIndex: 0,
      explanation: 'Unter 50% Wahrscheinlichkeit keine Passivierungspflicht (GoB), aber Angabe unter der Bilanz / im Anhang.'
    },
    {
      id: 'acc_6_4_q4',
      text: 'Wann wird die RSt aufgelöst?',
      options: ['Wenn der Prozess endet (Urteil/Vergleich) oder Grund entfällt', 'Am 31.12.', 'Nach 3 Jahren', 'Nie'],
      correctIndex: 0,
      explanation: 'Bei Verbrauch (Zahlung) oder wenn man gewinnt (Ertrag aus Auflösung).'
    },
    {
      id: 'acc_6_4_q5',
      text: 'Darf man künftige Gewinne aus anderen Prozessen gegenrechnen?',
      options: ['Nein, Saldierungsverbot', 'Ja, immer', 'Ja, wenn gleiches Gericht', 'Nur bei kleinen Beträgen'],
      correctIndex: 0,
      explanation: 'Vermögen und Schulden dürfen nicht saldiert werden (§ 246 Abs. 2 HGB).'
    }
  ],

  // ⭐ LEVEL 7 – Latente Steuern (Advanced)
  'acc_7_1': [
    {
      id: 'acc_7_1_q1',
      text: 'Welches Konzept liegt latenten Steuern zugrunde?',
      options: ['Temporary Concept (zeitliche Differenzen gleichen sich irgendwann aus)', 'Permanent Concept', 'Cash Flow Concept', 'Tax Evasion Concept'],
      correctIndex: 0,
      explanation: 'Es geht um Unterschiede zwischen HB und StB, die sich in Zukunft automatisch umkehren (temporär).'
    },
    {
      id: 'acc_7_1_q2',
      text: 'Was ist eine permanente Differenz?',
      options: ['Unterschiede, die sich nie ausgleichen (z.B. nicht abziehbare Betriebsausgaben)', 'Unterschiede in der AfA', 'Unterschiede bei RSt', 'Langfristige Kredite'],
      correctIndex: 0,
      explanation: 'Dauerhafte Unterschiede führen NICHT zu latenten Steuern, da sie sich nicht in Zukunft umkehren.'
    },
    {
      id: 'acc_7_1_q3',
      text: 'Berechnung: HB-Wert 100, StB-Wert 80 (Passivposten). Steuersatz 30%.',
      options: ['Aktive LSt: 20 Diff * 30% = 6', 'Passive LSt: 6', 'Keine LSt', 'Steuerschuld 20'],
      correctIndex: 0,
      explanation: 'Passivposten: HB höher als StB = Wir haben im HGB mehr Schulden als im Steuerrecht -> HGB Gewinn ist kleiner -> Steuerzahlung war "zu hoch" -> Aktive LSt.'
    },
    {
      id: 'acc_7_1_q4',
      text: 'Berechnung: HB-Wert 500, StB-Wert 200 (Aktivposten). Steuersatz 30%.',
      options: ['Passive LSt: 300 Diff * 30% = 90', 'Aktive LSt: 90', 'Passive LSt: 60', 'Nichts'],
      correctIndex: 0,
      explanation: 'Aktivposten: HB höher = Wir sind im HGB reicher als im Steuerrecht. Wir müssen künftig Steuern nachzahlen -> Passive LSt (Rückstellung).'
    },
    {
      id: 'acc_7_1_q5',
      text: 'Wie werden Verlustvorträge berücksichtigt?',
      options: ['Aktivierung möglich, soweit Verrechnung in nächsten 5 Jahren erwartet wird', 'Verbot', 'Passivierung', 'Müssen sofort verbraucht werden'],
      correctIndex: 0,
      explanation: 'Auf steuerliche Verlustvorträge dürfen aktive latente Steuern gebildet werden (Wahlrecht), sofern werthaltig.'
    }
  ],
  'acc_7_2': [ // Beispiele LSt
    {
      id: 'acc_7_2_q1',
      text: 'Aktivierte Entwicklungskosten (HGB) vs Verbot (StB). Was entsteht?',
      options: ['Passive latente Steuern', 'Aktive latente Steuern', 'Nichts', 'Steuererstattung'],
      correctIndex: 0,
      explanation: 'HGB Aktiv (Reich) > StB 0 (Arm). Wer im HGB reicher ist, muss später zahlen -> Passiv.'
    },
    {
      id: 'acc_7_2_q2',
      text: 'Disagio: HGB Aktivierungswahlrecht genutzt, Steuerrecht Pflicht. Identische Werte.',
      options: ['Keine latenten Steuern', 'Aktive', 'Passive', 'Beides'],
      correctIndex: 0,
      explanation: 'Wenn die Werte identisch sind, gibt es keine Differenz.'
    },
    {
      id: 'acc_7_2_q3',
      text: 'Drohverlustrückstellung in HGB gebildet, Steuerrecht nicht.',
      options: ['Aktive latente Steuern', 'Passive latente Steuern', 'Verbindlichkeit', 'Rücklage'],
      correctIndex: 0,
      explanation: 'HGB Passiv (Schulden) > StB Passiv (0). Wer im HGB ärmer ist, hat "zu viel" gezahlt -> Forderung -> Aktiv.'
    },
    {
      id: 'acc_7_2_q4',
      text: 'GoF Abschreibung: HGB 10 Jahre, Steuer 15 Jahre. Nach Jahr 1?',
      options: ['Aktive LSt', 'Passive LSt', 'Nichts', 'Steuerstrafverfahren'],
      correctIndex: 0,
      explanation: 'HGB schreibt schneller ab -> Wert sinkt schneller -> HGB-Wert < StB-Wert. Asset: HGB ärmer -> Aktive LSt.'
    },
    {
      id: 'acc_7_2_q5',
      text: 'Was bedeutet der "Nettoausweis" bei latenten Steuern?',
      options: ['Aktive und Passive LSt dürfen verrechnet werden', 'Man zeigt gar nichts', 'Man zeigt nur die Steuer', 'Nur Netto ohne USt'],
      correctIndex: 0,
      explanation: 'Man muss nicht beide Seiten aufblähen, sondern darf saldieren (§ 274 HGB).'
    }
  ],

  // ⭐ LEVEL 8 – GuV, Anhang, Lagebericht
  'acc_8_1': [ // GKV vs UKV
    {
      id: 'acc_8_1_q1',
      text: 'Wofür steht GKV?',
      options: ['Gesamtkostenverfahren', 'Gesamtkapitalverfahren', 'Großkundenvertrieb', 'Gewinnkostenvergleich'],
      correctIndex: 0,
      explanation: 'Gegenüberstellung ALLER Kosten der Periode gegen die Gesamtleistung (Umsatz + Lagerleistung).'
    },
    {
      id: 'acc_8_1_q2',
      text: 'Wofür steht UKV?',
      options: ['Umsatzkostenverfahren', 'Unkostenverfahren', 'Umsatzkapitalverfahren', 'Unterkonsumverfahren'],
      correctIndex: 0,
      explanation: 'Gegenüberstellung der Umsatzerlöse und der FÜR DEN UMSATZ angefallenen Kosten.'
    },
    {
      id: 'acc_8_1_q3',
      text: 'Welches Verfahren zeigt die "Bestandsveränderung" explizit?',
      options: ['GKV', 'UKV', 'Beide', 'Keines'],
      correctIndex: 0,
      explanation: 'Das GKV korrigiert die Produktion zur Gesamtleistung über den Posten Bestandsveränderung.'
    },
    {
      id: 'acc_8_1_q4',
      text: 'Führen beide Verfahren zum gleichen Jahresüberschuss?',
      options: ['Ja, zwingend', 'Nein, UKV ist genauer', 'Nein, GKV ist höher', 'Kommt auf die Branche an'],
      correctIndex: 0,
      explanation: 'Es sind nur unterschiedliche Darstellungsformen. Das Ergebnis unterm Strich muss identisch sein.'
    },
    {
      id: 'acc_8_1_q5',
      text: 'Welches Verfahren braucht eine Kostenstellenrechnung?',
      options: ['UKV (Zuordnung der Kosten zu Funktionsbereichen wie Vertrieb, Verwaltung)', 'GKV', 'Beide', 'Keines'],
      correctIndex: 0,
      explanation: 'Beim UKV muss man wissen, was "Herstellungskosten des Umsatzes" oder "Vertriebskosten" sind.'
    }
  ],
  'acc_8_2': [ // Anhang
    {
      id: 'acc_8_2_q1',
      text: 'Was ist die Hauptfunktion des Anhangs?',
      options: ['Erläuterung und Ergänzung der Bilanz/GuV', 'Werbung', 'Zukunftsprognose', 'Steuerberechnung'],
      correctIndex: 0,
      explanation: 'Die nackten Zahlen der Bilanz reichen nicht. Der Anhang erklärt Bilanzierungs- und Bewertungsmethoden.'
    },
    {
      id: 'acc_8_2_q2',
      text: 'Wer muss einen Anhang erstellen?',
      options: ['Alle Kapitalgesellschaften (und bestimmte PersG)', 'Jeder Kaufmann', 'Nur AGs', 'Nur Konzerne'],
      correctIndex: 0,
      explanation: 'Einzelkaufleute müssen keinen Anhang erstellen. KapGes schon.'
    },
    {
      id: 'acc_8_2_q3',
      text: 'Was steht im Anhang?',
      options: ['Angabe der Bewertungsmethoden (z.B. LIFO/FIFO)', 'Der Gewinn', 'Die Kontonummer', 'Das Wetter'],
      correctIndex: 0,
      explanation: 'Methoden, Währungsumrechnung, Haftungsverhältnisse, Geschäftsführergehälter (bei Großen) etc.'
    },
    {
      id: 'acc_8_2_q4',
      text: 'Was ist der "Anlagenspiegel"?',
      options: ['Entwicklung des Anlagevermögens (Zugänge, Abgänge, AfA)', 'Ein Spiegel im Büro', 'Liste der Investoren', 'Ein Vermögensverzeichnis'],
      correctIndex: 0,
      explanation: 'Er ist Teil des Anhangs und zeigt detailliert, wie sich das AV von 01.01. bis 31.12. entwickelt hat.'
    },
    {
      id: 'acc_8_2_q5',
      text: 'Gehört der Anhang zum Jahresabschluss?',
      options: ['Ja, zwingender Bestandteil', 'Nein, ist extra', 'Nur bei IFRS', 'Vielleicht'],
      correctIndex: 0,
      explanation: 'JA = Bilanz + GuV + Anhang (bei KapGes).'
    }
  ],
  'acc_8_3': [ // Lagebericht
    {
      id: 'acc_8_3_q1',
      text: 'Was ist der Zweck des Lageberichts?',
      options: ['Darstellung des Geschäftsverlaufs, der Lage und der Risiken/Chancen (Prognose)', 'Erklärung der Bilanzposten', 'Steueroptimierung', 'Rechenschaft über Vergangenheit'],
      correctIndex: 0,
      explanation: 'Der Lagebericht schaut auch in die Zukunft (Prognosebericht) und analysiert das "Big Picture".'
    },
    {
      id: 'acc_8_3_q2',
      text: 'Gehört der Lagebericht formal zum Jahresabschluss?',
      options: ['Nein, er ist ein eigenständiges Instrument neben dem JA', 'Ja, immer', 'Ja, Teil des Anhangs', 'Nur bei GmbHs'],
      correctIndex: 0,
      explanation: 'Er wird zusammen aufgestellt und geprüft, ist aber rechtlich kein Teil des JA.'
    },
    {
      id: 'acc_8_3_q3',
      text: 'Wer ist von der Lageberichtspflicht befreit?',
      options: ['Kleine Kapitalgesellschaften', 'Große AGs', 'Mittelgroße GmbHs', 'Banken'],
      correctIndex: 0,
      explanation: 'Kleine KapGes (§ 267 HGB) müssen keinen Lagebericht aufstellen.'
    },
    {
      id: 'acc_8_3_q4',
      text: 'Was sind "Nachtragsberichte"?',
      options: ['Bericht über Vorgänge von besonderer Bedeutung NACH dem Stichtag', 'Korrektur der Bilanz', 'Nachtisch', 'Bericht über Nachtarbeit'],
      correctIndex: 0,
      explanation: 'Wesentliche Ereignisse zwischen Bilanzstichtag und Aufstellungstag.'
    },
    {
      id: 'acc_8_3_q5',
      text: 'Welcher Berichtsteil ist oft der heikelste?',
      options: ['Prognose-, Chancen- und Risikobericht', 'Forschungsbericht', 'Zweigstellenbericht', 'Umweltbericht'],
      correctIndex: 0,
      explanation: 'Hier muss die Geschäftsführung Farbe bekennen, wie es weitergeht (Haftungsrisiko bei falschen Prognosen).'
    }
  ],
  'acc_8_4': [ // Prüfung & Offenlegung
    {
      id: 'acc_8_4_q1',
      text: 'Wer muss seinen Jahresabschluss prüfen lassen (Audit)?',
      options: ['Mittelgroße und große Kapitalgesellschaften', 'Alle Firmen', 'Nur AGs', 'Kleine GmbHs'],
      correctIndex: 0,
      explanation: 'Kleine GmbHs und Einzelkaufleute sind prüfungsbefreit.'
    },
    {
      id: 'acc_8_4_q2',
      text: 'Wer prüft den Abschluss?',
      options: ['Ein Wirtschaftsprüfer (WP)', 'Das Finanzamt', 'Die Bank', 'Der Geschäftsführer'],
      correctIndex: 0,
      explanation: 'Ein unabhängiger, bestellter Wirtschaftsprüfer.'
    },
    {
      id: 'acc_8_4_q3',
      text: 'Wo wird der Jahresabschluss offengelegt?',
      options: ['Unternehmensregister (Bundesanzeiger)', 'Tageszeitung', 'Facebook', 'Am Schwarzen Brett'],
      correctIndex: 0,
      explanation: 'Elektronisch im Bundesanzeiger / Unternehmensregister.'
    },
    {
      id: 'acc_8_4_q4',
      text: 'Was ist ein "Bestätigungsvermerk"?',
      options: ['Urteil des Prüfers, dass der JA den Gesetzen entspricht ("Testat")', 'Quittung für die Gebühr', 'Bestätigung des Eingangs', 'Unterschrift des Chefs'],
      correctIndex: 0,
      explanation: 'Das "Testat" ist das Gütesiegel für die Richtigkeit der Rechnungslegung.'
    },
    {
      id: 'acc_8_4_q5',
      text: 'Warum gibt es die Offenlegungspflicht?',
      options: ['Gläubigerschutz und Transparenz für Marktteilnehmer', 'Neugierde', 'Datenschutz', 'Papierverschwendung'],
      correctIndex: 0,
      explanation: 'Da bei der GmbH die Haftung beschränkt ist, müssen Gläubiger wissen, woran sie sind.'
    }
  ],

  // ⭐ BONUS-LEVEL – BILANZ-BOSSFIGHT
  'acc_boss_final': [
    {
      id: 'boss_q1',
      text: 'BOSS: Ein Unternehmen aktiviert 100k selbst geschaffene immaterielle VG und bildet 50k Drohverlustrückstellungen. Steuersatz 30%. Wie hoch sind die latenten Steuern (Saldo)?',
      options: ['Passive LSt 15k (100k passiv - 50k aktiv = 50k Überhang * 30%)', 'Aktive LSt 15k', 'Passive LSt 30k', 'Aktive LSt 45k'],
      correctIndex: 0,
      explanation: 'VG: HGB 100 / StB 0 -> 100 passiv. RSt: HGB 50 / StB 0 -> 50 aktiv. Saldo: 50 passiver Überhang. 50 * 0,3 = 15.'
    },
    {
      id: 'boss_q2',
      text: 'BOSS: Firma kauft Konkurrenten für 2 Mio. Net Assets = 1,5 Mio. Abschreibung GoF über 10 Jahre. Wie hoch ist der Buchwert des GoF nach 2 Jahren im HGB?',
      options: ['400.000 €', '500.000 €', '300.000 €', '450.000 €'],
      correctIndex: 0,
      explanation: 'GoF = 500k. AfA = 50k/Jahr. Nach 2 Jahren: 500 - 100 = 400k.'
    },
    {
      id: 'boss_q3',
      text: 'BOSS: Was verstößt gegen die Generalnorm (§ 264 Abs. 2 HGB) bei Kapitalgesellschaften?',
      options: ['Bildung stiller Reserven durch Unterbewertung (Willkür)', 'Nutzung von Wahlrechten', 'Offenlegung', 'Prüfung durch WP'],
      correctIndex: 0,
      explanation: 'Der JA muss ein "den tatsächlichen Verhältnissen entsprechendes Bild" (True and Fair View) vermitteln. Willkürliche stille Reserven verzerren dies.'
    },
    {
      id: 'boss_q4',
      text: 'BOSS: LIFO-Bewertung bei Inflation. Lagerbestand 100 Stk. Anfangsbestand war 10€/Stk. Zukäufe zu 12€, 15€, 20€. Am Ende sind 100 Stk da. Welcher Wert?',
      options: ['1.000 € (Eiserner Bestand bleibt bewertet zum alten Preis)', '2.000 €', '1.500 €', '1.200 €'],
      correctIndex: 0,
      explanation: 'Bei LIFO wird unterstellt, dass die neuen (teuren) Sachen verkauft wurden. Die alten (billigen) liegen noch da.'
    },
    {
      id: 'boss_q5',
      text: 'BOSS: Imparitätsprinzip vs Realisationsprinzip. Welches dominiert bei unrealisierten Verlusten?',
      options: ['Imparitätsprinzip (Verluste müssen raus)', 'Realisationsprinzip (nichts buchen)', 'Wahlrecht', 'Zufall'],
      correctIndex: 0,
      explanation: 'Das Imparitätsprinzip schränkt das Realisationsprinzip ein: Gewinne erst bei Realisation, Verluste aber schon bei Entstehung.'
    },
    {
      id: 'boss_q6',
      text: 'BOSS: Rückstellung für Instandhaltung. Nachholung erfolgt im 5. Monat des neuen Jahres. HGB?',
      options: ['Passivierungsverbot (da > 3 Monate)', 'Pflicht', 'Wahlrecht', 'Rücklage bilden'],
      correctIndex: 0,
      explanation: 'RSt für unterlassene Instandhaltung nur, wenn Nachholung innerhalb von 3 Monaten erfolgt (§ 249 HGB).'
    },
    {
      id: 'boss_q7',
      text: 'BOSS: Disagio bei Kreditaufnahme. HGB Behandlung?',
      options: ['Wahlrecht: Sofortaufwand oder aktiver RAP', 'Pflicht zur Aktivierung', 'Verbot der Aktivierung', 'Passivierung'],
      correctIndex: 0,
      explanation: '§ 250 Abs. 3 HGB: Disagio kann als ARAP aktiviert und über Laufzeit getilgt werden (oder sofort Aufwand).'
    },
    {
      id: 'boss_q8',
      text: 'BOSS: Was sind "Eigene Anteile" in der Bilanz (nach BilMoG)?',
      options: ['Offene Absetzung vom Eigenkapital (Minus-Posten)', 'Aktivposten im Umlaufvermögen', 'Aktivposten im Anlagevermögen', 'Rückstellung'],
      correctIndex: 0,
      explanation: 'Eigene Anteile werden nicht mehr aktiviert, sondern in der Vorspalte offen vom Gezeichneten Kapital abgesetzt (nennwert) bzw. verrechnet.'
    },
    {
      id: 'boss_q9',
      text: 'BOSS: Welche Funktion hat das "Maßgeblichkeitsprinzip"?',
      options: ['Die Handelsbilanz ist maßgeblich für die Steuerbilanz (mit Ausnahmen)', 'Steuerbilanz bestimmt Handelsbilanz', 'IFRS bestimmt alles', 'Chef bestimmt'],
      correctIndex: 0,
      explanation: 'Grundsätzlich gilt die Handelsbilanz auch für die Steuer, es sei denn, steuerliche Vorschriften (z.B. Drohverlust-Verbot) sagen was anderes.'
    },
    {
      id: 'boss_q10',
      text: 'BOSS: Einlage eines PKW aus Privatvermögen. Wert?',
      options: ['Teilwert (Marktwert) im Zeitpunkt der Einlage', 'Historische Anschaffungskosten', '1 Euro', 'Neupreis'],
      correctIndex: 0,
      explanation: 'Einlagen werden mit dem Teilwert (Wiederbeschaffungskosten/Marktwert) zum Zeitpunkt der Zuführung bewertet.'
    }
  ]
};

// --- TEMPLATE ENGINE TYPES ---

interface QuestionTemplate {
  id: string;
  subject: string;
  topic: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS';
  generate: () => Question;
}

// --- TEMPLATE DATABASE (Used for fallback/other subjects) ---

const templates: QuestionTemplate[] = [
  // --- ACCOUNTING: AfA (Abschreibung) ---
  {
    id: 'acc_afa_linear',
    subject: 'accounting',
    topic: 'afa',
    difficulty: 'EASY',
    generate: () => {
      const ak = randomInt(2, 20) * 1000; // 2.000 - 20.000
      const nd = randomInt(3, 10); // 3-10 years
      const afa = ak / nd;
      
      return {
        id: `gen_acc_afa_${Date.now()}`,
        text: `Ein Unternehmen kauft eine Maschine für ${fmt(ak)}. Die Nutzungsdauer beträgt ${nd} Jahre. Berechne die jährliche lineare Abschreibung.`,
        options: [
          fmt(afa),
          fmt(afa / 12),
          fmt(ak * 0.10),
          fmt(afa + 500)
        ],
        correctIndex: 0,
        explanation: `Lineare AfA = Anschaffungskosten (${fmt(ak)}) / Nutzungsdauer (${nd} Jahre) = ${fmt(afa)}.`
      };
    }
  },
   {
    id: 'math_percentage',
    subject: 'math',
    topic: 'basics',
    difficulty: 'EASY',
    generate: () => {
      const total = randomInt(2, 9) * 100;
      const percent = randomInt(1, 9) * 10;
      const value = total * (percent / 100);
      
      return {
        id: `gen_math_perc_${Date.now()}`,
        text: `Was sind ${percent}% von ${total}?`,
        options: [
          `${value}`,
          `${value * 2}`,
          `${value / 2}`,
          `${value + 15}`
        ],
        correctIndex: 0,
        explanation: `${total} * ${percent/100} = ${value}.`
      };
    }
  }
];

// --- GENERATOR FUNCTIONS ---

export const generateDynamicFlashcards = (
  subjectId: string, 
  topic: string,
  count: number = 5
): Flashcard[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `fc_gen_${i}`,
        front: `Karte ${i+1}`,
        back: 'Definition'
    }));
};

export const generateDynamicLevel = (
  subjectId: string, 
  topic: string | 'mix', 
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS',
  questionCount: number = 5,
  weakTopics: string[] = [],
  levelId?: string 
): Question[] => {
  
  // 1. Check for Static Hardcoded Questions (High Priority)
  if (levelId && STATIC_QUESTIONS[levelId]) {
      // Clone to avoid mutation of source
      const staticSet = JSON.parse(JSON.stringify(STATIC_QUESTIONS[levelId]));
      
      // Shuffle question order
      const shuffledQuestions = shuffleArray(staticSet).slice(0, questionCount);

      // Shuffle OPTIONS within each question
      return shuffledQuestions.map((q: Question) => {
         const newOptions = shuffleOptions(q.options, q.correctIndex, (newIdx) => { q.correctIndex = newIdx });
         return { ...q, options: newOptions };
      });
  }

  // 2. If no static questions, generate dynamic ones from templates
  let generatedQuestions: Question[] = [];
  
  if (subjectId === 'accounting' && (!levelId || !STATIC_QUESTIONS[levelId])) {
      return generateFallbackQuestions(topic, questionCount);
  }

  let availableTemplates = templates.filter(t => t.subject === subjectId);
  if (availableTemplates.length === 0) return generateFallbackQuestions(subjectId, questionCount);

  for (let i = 0; i < questionCount; i++) {
    const template = availableTemplates[randomInt(0, availableTemplates.length - 1)];
    const q = template.generate();
    q.options = shuffleOptions(q.options, q.correctIndex, (newIdx) => { q.correctIndex = newIdx; });
    generatedQuestions.push(q);
  }

  return generatedQuestions;
};

// Helper to shuffle options
function shuffleOptions(options: string[], correctIndex: number, setCorrectIndex: (i: number) => void): string[] {
  const indices = options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  const newOptions = indices.map(i => options[i]);
  const newCorrectIndex = indices.indexOf(correctIndex);
  setCorrectIndex(newCorrectIndex);
  
  return newOptions;
}

function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

function generateFallbackQuestions(topic: string, count: number): Question[] {
  const qs: Question[] = [];
  for(let i=0; i<count; i++) {
    qs.push({
      id: `fallback_${Date.now()}_${i}`,
      text: `Frage zu Thema: ${topic} (Inhalt folgt in Kürze)`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0,
      explanation: 'Dieser Level-Inhalt wird gerade erstellt.'
    });
  }
  return qs;
}

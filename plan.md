# Plan wdrozenia kraju (USA/PL) + dostosowanie do polskich realiow

## Cel
Dodac wybor kraju (USA/PL) i przygotowac przebudowe logiki podatkow i prawa emerytalnego tak, aby USA dzialalo jak teraz, a PL mialo osobne, jawne zasady. Bez kodowania na tym etapie.

## Zakres zmian (wysokopoziomowo)
- Wprowadzic nowy parametr `country` w profilu i stanie aplikacji.
- Dodac UI do wyboru kraju (pstryczek/select) z opcjami `USA` (domyslne, obecna logika) i `PL`.
- Rozdzielic logike podatkowa i emerytalna na modul per kraj, tak aby USA zostalo bez zmian, a PL moglo byc rozwijane niezaleznie.
- Zaktualizowac teksty/metodologie i pomoc (tooltipy) tak, aby odzwierciedlaly wybrany kraj.
- Dodac testy jednostkowe dla PL oraz utrzymac istniejece testy USA.

## Plan krokow (detalicznie)
1) **Model danych i stan**
   - Dodac typ `Country` (np. `"usa" | "pl"`).
   - Rozszerzyc `Profile` o pole `country`.
   - Ustalic domyslne `country: "usa"` w `DEFAULT_PROFILE`.
   - Ustalic, ktore pola profilu sa zalezne od kraju (np. `filingStatus`, `stateTaxRate`, `socialSecurity...`) i jak beda mapowane dla PL.

2) **UI: wybor kraju (pstryczek) i adaptacja formularzy**
   - Dodac selector kraju w `ProfileForm` (np. obok `Filing Status`).
   - Utrzymac obecne pola dla USA.
   - Dla PL zaplanowac widocznosc/etykiety:
     - zamiennik `Filing Status` (np. "Status rozliczenia" albo brak, jesli niepotrzebny),
     - brak `State Tax Rate` (PL ma podatek krajowy; ewentualnie pole "podatek lokalny" tylko jesli konieczne),
     - zamiana "Social Security" na odpowiednik PL (np. ZUS) lub sekcja wylaczona jesli model uproszczony.
   - Ustalic logike ukrywania/zmiany etykiet na podstawie `country`.

3) **Architektura podatkow i prawa (USA bez zmian, PL osobny modul)**
   - Wydzielic interfejs `TaxEngine` (lub funkcje) obsugujace:
     - progi podatkowe/kwoty wolne,
     - opodatkowanie dochodow z wyplat (pretax/roth/taxable),
     - podatki od zyskow kapitalowych,
    - podatki "stanowe" (USA) vs brak/inna struktura (PL).
   - Dla USA pozostawic obecne dane z `src/utils/constants.ts` i `src/utils/taxes.ts`.
   - Dla PL zdefiniowac osobny zestaw stal (progi, kwota wolna, stawki ryczaltowe, itp.).
   - Dostosowac obliczenia w `withdrawals.ts` tak, aby korzystaly z silnika per kraj.

4) **Logika emerytalna i konta per kraj**
   - Okreslic, jak konta USA mapuja sie na PL (np. IKE/IKZE, rachunek maklerski). Na start mozna:
     - zachowac typy kont jako wspolne, ale zmienic opisy/tekst w UI dla PL,
     - albo wprowadzic osobne typy kont dla PL (IKE/IKZE/PPK), z mapowaniem na `TaxTreatment`.
   - Dla USA zachowac RMD i obecne zasady.
   - Dla PL zdefiniowac odpowiednik (np. brak RMD) i ustawic logike tak, by RMD nie byla liczona.

5) **Metodologia i teksty**
   - `MethodologyPanel` i `SummaryCards` maja wiele opisow USA (RMD, Social Security, standard deduction). Zaplanowac:
     - warunkowe renderowanie sekcji w zaleznosci od `country`,
     - osobny opis dla PL (zrodla i zalozenia do uzupelnienia).

6) **Testy**
   - Dodac osobny zestaw testow dla PL (podatki, brak RMD, inne progi).
   - Zachowac wszystkie testy USA bez zmian, aby potwierdzic brak regresji.

7) **Dane i zrodla (rozszerzony zakres podatkowy PL)**
   - **Status rezydencji podatkowej**: rezydent PL vs nierezydent, zasady opodatkowania dochodow zagranicznych.
   - **Formy zatrudnienia / zrodla dochodu**:
     - umowa o prace (PIT + skladki ZUS),
     - umowa zlecenie / o dzielo (inne skladki i koszty uzyskania przychodu),
     - JDG (zasady wyboru formy opodatkowania),
     - kontrakt B2B / samozatrudnienie (w praktyce JDG),
     - dochody pasywne: najem, dywidendy, odsetki.
   - **Formy opodatkowania JDG**:
     - skala podatkowa (PIT 12%/32% + kwota wolna),
     - podatek liniowy 19%,
     - ryczalt od przychodow ewidencjonowanych (stawki zalezne od PKWiU),
     - karta podatkowa (jesli w ogole uwzgledniamy; obecnie wygaszana).
   - **Progi i kwoty**:
     - progi PIT na skali (kwoty, stawki),
     - kwota wolna od podatku i jej wplyw,
     - progi dochodowe dla ulg i ograniczen (jesli uwzgledniamy).
   - **Skladki ZUS i zdrowotna**:
     - skladki spoleczne (emerytalna, rentowa, chorobowa, wypadkowa),
     - skladka zdrowotna (zaleznosci od formy opodatkowania i dochodu),
     - ulgi typu "maly ZUS", "maly ZUS plus", preferencyjny ZUS (jesli modelujemy).
   - **Podatek od zyskow kapitalowych (Belka)**:
     - stawka 19% od zyskow z kapitalu,
     - rozliczanie strat i ich wplyw na podatek.
   - **Kontenery emerytalne / inwestycyjne**:
     - IKE (zwolnienie z podatku Belki po spelnieniu warunkow),
     - IKZE (odliczenie od podstawy opodatkowania + podatek ryczaltowy przy wyplacie),
     - PPK (zasady wpłat, doplat, opodatkowania przy wyplacie),
     - PPE (jesli uwzgledniamy),
     - rachunek maklerski (opodatkowanie zyskow).
   - **Renty i swiadczenia emerytalne**:
     - ZUS: sposob waloryzacji, opodatkowanie swiadczen,
     - emerytury zagraniczne (umowy o unikaniu podwojnego opodatkowania).
   - **Ulgi i preferencje**:
     - ulga dla klasy sredniej (historycznie) i obecne odpowiedniki,
     - ulga na dzialalnosc badawczo-rozwojowa, IP Box (opcjonalnie),
     - ulgi prorodzinne, inne (raczej poza MVP).
   - **VAT** (tylko jesli modelujemy realny cashflow JDG):
     - zwolnienia, stawki, wplyw na dochod netto.
   - **Rozliczenie malzenskie**:
     - wspolne rozliczenie malzonkow na skali,
     - osoby samotnie wychowujace dzieci (opcjonalnie).
   - **Inflacja i waloryzacja**:
     - waloryzacja progow, kwot wolnych, skladek,
     - waloryzacja swiadczen ZUS.
   - **Kursy walut i dochody zagraniczne**:
     - przewalutowanie dochodow i inwestycji,
     - metody unikania podwojnego opodatkowania (wykreslenie, proporcjonalne).
   - **Zasady wyplat w okresie emerytalnym**:
     - kolejnosc wyplat z kont opodatkowanych / zwolnionych,
     - konsekwencje podatkowe wyplat z IKE/IKZE/PPK.
   - **Minimalny MVP**:
     - PIT skala + kwota wolna,
     - podatek Belki 19%,
     - IKE/IKZE jako osobne typy kont z prostymi zasadami,
     - ZUS emerytura jako uproszczony strumien dochodu (opcjonalnie).

8) **UX i waluta**
   - Ustalic czy wyswietlana waluta ma sie zmieniac (USD/PLN) i gdzie to ustawic.
   - Ustalic formaty etykiet (np. "$" vs "zl") w formatowaniu.

## Lista plikow dotknietych (docelowo, bez edycji teraz)
- `src/types/index.ts` (nowy typ `Country`, pole `country` w profilu)
- `src/utils/constants.ts` (domyslne `country`, dane USA bez zmian + opcjonalne stale PL)
- `src/utils/taxes.ts` (routing per kraj, nowe funkcje PL)
- `src/utils/withdrawals.ts` (logika kraju, RMD tylko dla USA)
- `src/components/ProfileForm.tsx` (selector kraju + zmienne etykiety/pola)
- `src/components/MethodologyPanel.tsx` (sekcje per kraj)
- `src/components/SummaryCards.tsx` (teksty per kraj)
- `src/tests/calculations.test.ts` (testy PL + utrzymanie USA)

## Otwarte decyzje / pytania
- Jakie dokladnie zasady PL wchodza do MVP? (PIT, kwota wolna, podatek Belki, skladki ZUS, IKZE/IKE, PPK)
- Czy PL ma miec osobne typy kont (IKE/IKZE/PPK), czy mapujemy na istniejace?
- Czy waluta ma sie automatycznie zmieniac z krajem, czy uzytkownik wybiera osobno?
- Jaki poziom szczegolowosci podatkow PL jest oczekiwany (brutto/netto, skladki zdrowotne)?

## Kryteria akceptacji planu
- Jest mozliwosc wyboru kraju (USA/PL), a USA zachowuje obecne zachowanie.
- Logika podatkow i opisow jest rozdzielona per kraj.
- Jest jasna sciezka do implementacji PL bez naruszania testow USA.

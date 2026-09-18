# Zielony Koszyk

Projekt semestralny: statyczna aplikacja do obsługi sklepu spożywczego. Interfejs w języku polskim, bez instalowania zależności i bez procesu budowania.

## Uruchomienie

Otwórz `index.html` w aktualnej przeglądarce. Zalecane uruchomienie przez lokalny serwer, np. `python -m http.server 8080` w folderze projektu, a następnie wejście na `http://localhost:8080`. Serwer nie jest backendem — tylko udostępnia pliki.

## Funkcje

- Pulpit: rzeczywiste statystyki zapisanych transakcji, niski stan magazynu, ostatnia sprzedaż.
- Sklep klienta: wyszukiwanie, kategorie, koszyk i demonstracyjne zamówienie opłacane kartą.
- Kasa tradycyjna: wpisywanie kodów kreskowych (również czytnik działający jak klawiatura z Enter), wybór produktów, symulator wagi, gotówka z wyliczeniem reszty i symulacja karty.
- Kasa samoobsługowa: skanowanie / wybór produktów, waga i symulowana płatność kartą.
- Magazyn: dodawanie, edycja, usuwanie, unikalne kody, ceny, jednostki, VAT i stany.
- Historia: paragony demonstracyjne z możliwością wydruku, eksport CSV.
- Baza: trwały zapis lokalny, walidowany import / eksport JSON, reset po potwierdzeniu.

## GitHub Pages

1. Utwórz repozytorium i dodaj `index.html`, `kasa.html`, `style.css`, `kiosk.css`, `app.js`, `kiosk-ui.js`, `scanner.js`, `qrcode.min.js`, `LICENSE-qrcode.txt` oraz `.nojekyll` do jego głównego katalogu.
2. W ustawieniach repozytorium otwórz Pages. Wybierz publikację z gałęzi `main` i katalogu głównego (`/root`).
3. Po publikacji otwórz adres przydzielony repozytorium przez GitHub Pages.

Wszystkie ścieżki do zasobów są względne, więc aplikacja działa również w podkatalogu repozytorium. Czcionki Google Fonts są opcjonalne; bez sieci używane są czcionki systemowe.

## Model danych i ograniczenia

Baza jest obiektem JSON w localStorage pod kluczem `zielony-koszyk-v1`: `version`, `products`, `sales`. Produkty zawierają identyfikator, nazwę, kategorię, cenę w groszach, stan, jednostkę, emoji, kod i demonstracyjną stawkę VAT. Sprzedaż przechowuje datę, kanał, metodę płatności, otrzymaną kwotę, sumę i kopie pozycji, aby późniejsza edycja produktu nie zmieniła paragonu. Kwoty pozycji są zaokrąglane do grosza, masy do grama. Zapis sprzedaży i aktualizacja magazynu następują w jednym zapisie bazy.

Dane dotyczą konkretnej przeglądarki i adresu strony. Uruchomienie z pliku i z GitHub Pages oznacza oddzielne bazy; do przeniesienia użyj JSON. Tryb prywatny lub czyszczenie danych przeglądarki może usunąć bazę. Wykonuj kopie. Koszyki są tymczasowe i znikają po odświeżeniu. Współpraca kilku osób / urządzeń, autoryzacja, trwały serwer bazy i rzeczywiste płatności wymagają backendu. Karty tej samej przeglądarki odbierają aktualizacje; równoczesna praca administratorów nie jest wspierana.

To projekt edukacyjny: brak rzeczywistych płatności, faktur i fiskalizacji. Dane, kody i stawki VAT są przykładowe, nie stanowią aktualnej klasyfikacji podatkowej. Konta i role nie są zabezpieczeniem — wszystkie panele są dostępne publicznie. Importuj wyłącznie demonstracyjne dane bez informacji osobowych.

## Kontrola działania

1. W sklepie dodaj chleb i 0,5 kg pomidorów, przejdź do płatności i zatwierdź kartę. Sprawdź paragon, historię i spadek stanów.
2. W kasie tradycyjnej zeskanuj `5901234000004`, wybierz gotówkę. Zbyt mała kwota powinna blokować sprzedaż; 10 zł powinno dać 3,01 zł reszty przy początkowej cenie chleba.
3. Spróbuj dodać ilość większą niż stan. Operacja powinna być odrzucona.
4. Dodaj / edytuj produkt. Powtórzony kod i ułamkowy stan dla sztuk powinny być odrzucone.
5. Wyeksportuj JSON, odśwież stronę, sprawdź dane, a następnie przetestuj import kopii. Błędny plik powinien pozostawić bazę bez zmian.
6. Sprawdź na wąskim ekranie i przejdź formularze klawiaturą.

## Osobna kasa na tablecie Samsung

Otwórz kasa.html. Obsługa czytnika HID, trybu dotykowego i ograniczenia blokady opisane są w [SAMSUNG-TABLET.md](SAMSUNG-TABLET.md).

## Panel startowy i wygląd kasy

Zakładka „Kasa samoobsługowa” otwiera dwa panele. Po lewej jest lokalnie generowany QR i „Otwórz emulator”, po prawej „Przejdź do pulpitu administracyjnego”. Emulator `kasa.html` ma układ wzorowany na przesłanym zdjęciu: ostatni produkt po lewej, lista zakupów po prawej, zielone wyszukiwanie i płatność na dole. Własne oznaczenie Zielony Koszyk pozostaje w nagłówku.

Na HTTP/HTTPS QR automatycznie wskazuje `kasa.html` w tym samym katalogu. Przy otwarciu pliku lokalnego wpisz publiczny adres emulatora w „Adres kasy dla kodu QR”. Kod nie przenosi bazy danych. Generator jest dostarczony w projekcie: [QRCode.js](https://github.com/davidshimjs/qrcodejs), licencja MIT w LICENSE-qrcode.txt. Generowanie nie wysyła adresu do zewnętrznego serwisu.

Testy logiki: `node tests.cjs` (Node.js 18+). Testują m.in. generowanie QR, routing, skanowanie HID, obliczenia dla wagi i sztuk oraz zapis sprzedaży ze zmianą magazynu. Nie zastępują testu fizycznego skanera ani układu w Samsung Internet.
# Kasa na Galaxy Tab A9+ / Samsung Internet

## Uruchomienie

Opublikuj wszystkie pliki HTML, CSS i JS projektu na GitHub Pages. Na tablecie otwórz w Samsung Internet adres kończący się `/kasa.html`. Wybierz „Pełny ekran”. Strona ma duże przyciski dotykowe, działa pionowo i poziomo, bez menu administracyjnego. Zmiana fragmentu adresu, np. na `#inventory`, nie otwiera panelu administratora w tej stronie.

Kasa i panel `index.html` korzystają z tej samej bazy tylko w obrębie tego samego adresu, profilu i przeglądarki. Panel na komputerze nie synchronizuje danych z tabletem. Wczytaj kopię JSON w panelu na tablecie przed rozpoczęciem prezentacji. Nie używaj trybu tajnego, jeśli chcesz zachować bazę po zamknięciu przeglądarki.

## Skaner fizyczny

Potrzebny jest skaner z trybem **HID Keyboard** (emulacja klawiatury), który wysyła kod jako cyfry i kończy go klawiszem **Enter / CR**. USB: podłącz przez zgodny adapter USB-C OTG lub hub z obsługą danych. Bluetooth: sparuj skaner z tabletem i wybierz w skanerze tryb HID, nie SPP / port szeregowy. Dostępność zasilania i kompatybilność zależą od skanera oraz adaptera.

1. W instrukcji skanera ustaw HID Keyboard, brak prefiksu oraz sufiks Enter. Dla automatycznego rozpoznawania poza polem kodu odstęp między znakami powinien być mniejszy niż 150 ms. W polu kodu wolniejsze skanowanie z Enterem również działa.
2. Najpierw sprawdź w zwykłym polu tekstowym na tablecie, czy odczyt daje pełny kod i Enter.
3. W panelu produktów wprowadź dokładny kod z opakowania. Początkowe kody w projekcie są przykładowymi identyfikatorami, nie zweryfikowanymi numerami EAN. Nie należy oczekiwać, że dowolny towar ze sklepu znajdzie się automatycznie w bazie.
4. Otwórz kasę i skanuj. Obsługiwane są numery 8–14 cyfr; zera z początku kodu zostają zachowane. Ponowny skan zwiększa ilość. Towar na wagę otwiera formularz masy.
5. Klawiatura ekranowa pola czytnika jest domyślnie ukryta. Na ekranie emulatora „Wyszukaj po nazwie lub wprowadź kod” otwiera wyszukiwanie i klawiaturę. W kasie tradycyjnej służy do tego „Wpisz kod ręcznie”. Jeżeli Samsung nadal ją pokazuje przy czytniku, sprawdź ustawienie pokazywania klawiatury ekranowej przy podłączonej klawiaturze fizycznej.

Nie jest wymagany dostęp strony do USB ani kamery: czytnik działa jak klawiatura. W trakcie płatności lub wpisywania masy najpierw zamknij / zakończ okno, a potem skanuj następny produkt. Strona próbuje utrzymać ekran włączony, jeśli przeglądarka pozwala; w razie odmowy ustaw czas wygaszania na tablecie.

## Blokowanie opuszczania aplikacji

W ustawieniach Samsunga wyszukaj **Przypinanie aplikacji** (nazwy mogą zależeć od wersji One UI). Zwykle: Ustawienia → Bezpieczeństwo i prywatność → Więcej ustawień zabezpieczeń → Przypinanie aplikacji.

Włącz przypinanie oraz wymaganie kodu PIN / blokady ekranu przy odpinaniu. Otwórz Samsung Internet z kasą, przejdź do ostatnich aplikacji, dotknij ikony Samsung Internet i wybierz przypięcie. Ustaw PIN znany obsłudze. Odpinanie wykonuje się gestem lub kombinacją przycisków wskazaną przez system; następnie wymagane jest odblokowanie.

**Granica blokady:** przypięcie blokuje opuszczanie Samsung Internet, ale nie blokuje pojedynczego adresu wewnątrz przeglądarki. Pełny ekran również nie jest zabezpieczeniem — użytkownik może ujawnić interfejs przeglądarki. Czysta strona HTML w Samsung Internet nie może zagwarantować blokady konkretnej strony, przycisków systemowych ani dostępu do innych kart. Brak menu administracyjnego w kasie nie zastępuje uprawnień do bazy.

Jeżeli stanowisko ma być niedostępne dla obchodzenia blokady przez klientów, potrzebne jest zarządzane wdrożenie Android kiosk / Samsung Knox z ograniczeniem do wybranego adresu albo aplikacja kiosku. Tego nie da się aktywować plikami na GitHub Pages. Ten projekt nie instaluje takiego rozwiązania i nie zmienia ustawień tabletu.

Oficjalne instrukcje Samsunga:
- [Przypinanie aplikacji na telefonie lub tablecie](https://www.samsung.com/us/support/answer/ANS10004865/)
- [Przypinanie i PIN przy odpinaniu](https://news.samsung.com/us/samsung-knox-journals-tired-prying-eyes-personal-information-how-to-stop-it/)

## Test na docelowym urządzeniu

- Otwórz `kasa.html` w pionie i poziomie. Sprawdź pełny ekran, dotyk i powrót fokusu czytnika po zamknięciu okna.
- Zeskanuj zarejestrowany kod dwa razy: ilość ma wynieść 2. Nieznany kod nie może zmienić koszyka; następny poprawny skan ma zadziałać.
- Zeskanuj kod po dotknięciu produktu i po użyciu wyszukiwarki. Sprawdź, że Enter nie uruchamia płatności.
- Zeskanuj produkt na wagę, wpisz masę ręcznie. Skanowanie podczas otwartego okna nie powinno zatwierdzać masy ani płatności.
- Zakończ zakup i sprawdź magazyn / historię w panelu w tej samej przeglądarce.
- Włącz przypinanie z PIN-em i sprawdź blokadę opuszczania aplikacji. Osobno sprawdź ograniczenie opisane wyżej: przypinanie nie blokuje innej strony w Samsung Internet.

Nie wykonano fizycznego testu na Galaxy Tab A9+ ani z czytnikiem — zgodność konkretnego modelu czytnika wymaga tego testu.

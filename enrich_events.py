"""
ChronoHeroes — Script d'enrichissement automatique de la base Supabase
Usage : python enrich_events.py
"""

from supabase import create_client
from datetime import date
import calendar

SUPABASE_URL = "https://geabolpfdjrclhpqxcwi.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYWJvbHBmZGpyY2xocHF4Y3dpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODE1NTMyNiwiZXhwIjoyMDkzNzMxMzI2fQ.T4BsishTPZulNh9vBloSnMa6jq7cpobLgykXtCI0aW4"

def compute_age(birth_str, event_str):
    by, bm, bd = map(int, birth_str.split('-'))
    ey, em, ed = map(int, event_str.split('-'))
    birth = date(by, bm, bd)
    event = date(ey, em, ed)
    age_days = (event - birth).days
    y = ey - by
    m = em - bm
    d = ed - bd
    if d < 0:
        m -= 1
        d += calendar.monthrange(ey, em - 1 if em > 1 else 12)[1]
    if m < 0:
        y -= 1
        m += 12
    jour = 'jour' if d == 1 else 'jours'
    return age_days, y, m, d, f"{y} ans, {m} mois et {d} {jour}"

NEW_EVENTS = [
    # Abraham Lincoln (1809-02-12)
    ("1e46da67-5060-4b3b-b754-26597b4e9e5d", "Abraham Lincoln", "1809-02-12", "1832-04-01", "S'engage comme volontaire dans la guerre contre les Indiens Sauk — élu capitaine par ses hommes", "pouvoir", "debut", 4),
    ("1e46da67-5060-4b3b-b754-26597b4e9e5d", "Abraham Lincoln", "1809-02-12", "1836-09-09", "Obtient sa licence d'avocat — autodidacte, il a appris le droit seul avec des livres empruntés", "pouvoir", "formation", 4),
    ("1e46da67-5060-4b3b-b754-26597b4e9e5d", "Abraham Lincoln", "1809-02-12", "1846-08-03", "Élu au Congrès américain — premier mandat à Washington", "pouvoir", "election", 4),
    ("1e46da67-5060-4b3b-b754-26597b4e9e5d", "Abraham Lincoln", "1809-02-12", "1860-11-06", "Élu 16e président des États-Unis — premier républicain à accéder à la Maison Blanche", "pouvoir", "election", 5),
    ("1e46da67-5060-4b3b-b754-26597b4e9e5d", "Abraham Lincoln", "1809-02-12", "1863-01-01", "Proclame l'émancipation des esclaves — 3 millions de personnes libérées en théorie", "pouvoir", "loi", 5),
    ("1e46da67-5060-4b3b-b754-26597b4e9e5d", "Abraham Lincoln", "1809-02-12", "1863-11-19", "Discours de Gettysburg — 272 mots qui redéfinissent la démocratie américaine", "pouvoir", "discours", 5),
    ("1e46da67-5060-4b3b-b754-26597b4e9e5d", "Abraham Lincoln", "1809-02-12", "1865-04-14", "Assassiné au théâtre Ford par John Wilkes Booth à 56 ans — 5 jours après la fin de la guerre", "pouvoir", "mort", 5),
    # Martin Luther King (1929-01-15)
    ("7269e3ec-7055-4382-a2b8-901301776ac9", "Martin Luther King", "1929-01-15", "1954-05-02", "Prend ses fonctions de pasteur à Montgomery — commence à s'engager pour les droits civiques", "pouvoir", "debut", 4),
    ("7269e3ec-7055-4382-a2b8-901301776ac9", "Martin Luther King", "1929-01-15", "1955-12-05", "Lance le boycott des bus de Montgomery — 381 jours de marche pour l'égalité raciale", "pouvoir", "engagement", 5),
    ("7269e3ec-7055-4382-a2b8-901301776ac9", "Martin Luther King", "1929-01-15", "1960-02-01", "Soutient les sit-ins de Greensboro — étudiants noirs refusant de quitter les comptoirs blancs", "pouvoir", "engagement", 4),
    ("7269e3ec-7055-4382-a2b8-901301776ac9", "Martin Luther King", "1929-01-15", "1963-04-16", "Écrit sa Lettre de la prison de Birmingham — manifeste de la désobéissance civile non-violente", "pouvoir", "publication", 5),
    ("7269e3ec-7055-4382-a2b8-901301776ac9", "Martin Luther King", "1929-01-15", "1964-12-10", "Reçoit le prix Nobel de la Paix à 35 ans — le plus jeune lauréat de l'histoire", "pouvoir", "prix", 5),
    ("7269e3ec-7055-4382-a2b8-901301776ac9", "Martin Luther King", "1929-01-15", "1967-04-04", "Discours contre la guerre du Vietnam — rompt avec Johnson, isolé par ses alliés", "pouvoir", "discours", 4),
    ("7269e3ec-7055-4382-a2b8-901301776ac9", "Martin Luther King", "1929-01-15", "1968-04-04", "Assassiné à Memphis à 39 ans — la veille il avait prononcé son discours J'ai vu la Terre promise", "pouvoir", "mort", 5),
    # Karl Marx (1818-05-05)
    ("20dc6f6c-d962-4616-b622-721a85329f25", "Karl Marx", "1818-05-05", "1842-10-15", "Devient rédacteur en chef de la Gazette rhénane — journal interdit 6 mois plus tard", "pouvoir", "debut", 4),
    ("20dc6f6c-d962-4616-b622-721a85329f25", "Karl Marx", "1818-05-05", "1844-08-01", "Rencontre Engels à Paris — début d'une amitié et collaboration intellectuelle de 40 ans", "pouvoir", "rencontre", 5),
    ("20dc6f6c-d962-4616-b622-721a85329f25", "Karl Marx", "1818-05-05", "1848-02-21", "Publie le Manifeste du Parti communiste avec Engels — 23 pages qui changeront le monde", "pouvoir", "publication", 5),
    ("20dc6f6c-d962-4616-b622-721a85329f25", "Karl Marx", "1818-05-05", "1849-08-01", "S'exile à Londres — vivra dans la pauvreté, soutenu financièrement par Engels", "pouvoir", "exil", 4),
    ("20dc6f6c-d962-4616-b622-721a85329f25", "Karl Marx", "1818-05-05", "1864-09-28", "Fonde la Première Internationale — première organisation ouvrière mondiale", "pouvoir", "creation", 5),
    ("20dc6f6c-d962-4616-b622-721a85329f25", "Karl Marx", "1818-05-05", "1867-09-14", "Publie le premier tome du Capital — analyse scientifique du capitalisme", "pouvoir", "publication", 5),
    ("20dc6f6c-d962-4616-b622-721a85329f25", "Karl Marx", "1818-05-05", "1883-03-14", "Meurt à Londres à 64 ans — enterré à Highgate avec 11 personnes présentes", "pouvoir", "mort", 5),
    # Maximilien Robespierre (1758-05-06)
    ("632ff8e2-8ab0-40bc-8c91-872281a47afd", "Maximilien Robespierre", "1758-05-06", "1789-05-01", "Élu député du Tiers-État aux États généraux — représente Arras, défend les plus pauvres", "pouvoir", "election", 4),
    ("632ff8e2-8ab0-40bc-8c91-872281a47afd", "Maximilien Robespierre", "1758-05-06", "1791-09-30", "Surnommé l'Incorruptible à l'Assemblée — refuse toute compromission avec les privilèges", "pouvoir", "distinction", 4),
    ("632ff8e2-8ab0-40bc-8c91-872281a47afd", "Maximilien Robespierre", "1758-05-06", "1793-07-27", "Entre au Comité de Salut public — devient l'homme fort de la Révolution", "pouvoir", "nomination", 5),
    ("632ff8e2-8ab0-40bc-8c91-872281a47afd", "Maximilien Robespierre", "1758-05-06", "1793-10-16", "Fait exécuter Marie-Antoinette — la Terreur s'installe, 17 000 condamnés à mort", "pouvoir", "decision", 5),
    ("632ff8e2-8ab0-40bc-8c91-872281a47afd", "Maximilien Robespierre", "1758-05-06", "1794-06-08", "Organise la Fête de l'Être Suprême — apogée de son pouvoir, il préside en grand prêtre", "pouvoir", "ceremonie", 4),
    ("632ff8e2-8ab0-40bc-8c91-872281a47afd", "Maximilien Robespierre", "1758-05-06", "1794-07-27", "Renversé lors de la journée du 9 Thermidor — arrêté à l'Hôtel de Ville", "pouvoir", "chute", 5),
    ("632ff8e2-8ab0-40bc-8c91-872281a47afd", "Maximilien Robespierre", "1758-05-06", "1794-07-28", "Guillotiné à Paris à 36 ans — la foule l'acclame puis l'insulte au pied de l'échafaud", "pouvoir", "mort", 5),
    # Jean Jaurès (1859-09-03)
    ("5cc94328-fbdf-4919-9f76-6621182ee838", "Jean Jaures", "1859-09-03", "1885-10-04", "Élu député républicain du Tarn à 26 ans — le plus jeune député de France", "pouvoir", "election", 4),
    ("5cc94328-fbdf-4919-9f76-6621182ee838", "Jean Jaures", "1859-09-03", "1893-09-01", "Réélu député socialiste — défend les mineurs de Carmaux en grève", "pouvoir", "election", 4),
    ("5cc94328-fbdf-4919-9f76-6621182ee838", "Jean Jaures", "1859-09-03", "1898-01-19", "Prend la défense de Dreyfus — bascule toute la gauche dans l'affaire", "pouvoir", "engagement", 5),
    ("5cc94328-fbdf-4919-9f76-6621182ee838", "Jean Jaures", "1859-09-03", "1904-04-18", "Fonde L'Humanité — journal socialiste qu'il dirige jusqu'à sa mort", "pouvoir", "creation", 5),
    ("5cc94328-fbdf-4919-9f76-6621182ee838", "Jean Jaures", "1859-09-03", "1905-04-23", "Réunit les deux partis socialistes français en une seule SFIO — unité de la gauche", "pouvoir", "creation", 5),
    ("5cc94328-fbdf-4919-9f76-6621182ee838", "Jean Jaures", "1859-09-03", "1914-07-25", "Parcourt l'Europe pour éviter la guerre — appelle à la grève générale internationale", "pouvoir", "engagement", 5),
    ("5cc94328-fbdf-4919-9f76-6621182ee838", "Jean Jaures", "1859-09-03", "1914-07-31", "Assassiné au café du Croissant à Paris à 54 ans — tué par un nationaliste 3 jours avant la guerre", "pouvoir", "mort", 5),
    # Georges Danton (1759-10-26)
    ("77f8502c-58ea-4021-9e72-21210533b3e5", "Georges Danton", "1759-10-26", "1789-07-14", "Harangue le peuple au Palais-Royal la veille — contribue à déclencher la prise de la Bastille", "pouvoir", "engagement", 5),
    ("77f8502c-58ea-4021-9e72-21210533b3e5", "Georges Danton", "1759-10-26", "1792-08-10", "Mène l'insurrection des Tuileries — chute de la monarchie, il devient ministre de la Justice", "pouvoir", "engagement", 5),
    ("77f8502c-58ea-4021-9e72-21210533b3e5", "Georges Danton", "1759-10-26", "1792-09-02", "Prononce son discours De l'audace — galvanise la France face à l'invasion prussienne", "pouvoir", "discours", 5),
    ("77f8502c-58ea-4021-9e72-21210533b3e5", "Georges Danton", "1759-10-26", "1793-04-06", "Membre fondateur du Comité de Salut public — puis écarté par Robespierre", "pouvoir", "nomination", 4),
    ("77f8502c-58ea-4021-9e72-21210533b3e5", "Georges Danton", "1759-10-26", "1793-12-01", "Réclame la clémence — s'oppose à la Terreur, rompt avec Robespierre", "pouvoir", "engagement", 5),
    ("77f8502c-58ea-4021-9e72-21210533b3e5", "Georges Danton", "1759-10-26", "1794-04-05", "Guillotiné à 34 ans — sur l'échafaud : Tu montreras ma tête au peuple, elle en vaut la peine", "pouvoir", "mort", 5),
    # Johann Sebastian Bach (1685-03-21)
    ("1e260568-19cc-4cde-baed-f7d608d4c207", "Johann Sebastian Bach", "1685-03-21", "1703-07-09", "Nommé organiste à Arnstadt à 18 ans — commence à composer intensément", "arts", "nomination", 4),
    ("1e260568-19cc-4cde-baed-f7d608d4c207", "Johann Sebastian Bach", "1685-03-21", "1705-10-01", "Marche 400 km à pied pour étudier avec Buxtehude à Lübeck — reste 4 mois au lieu de 4 semaines", "arts", "formation", 5),
    ("1e260568-19cc-4cde-baed-f7d608d4c207", "Johann Sebastian Bach", "1685-03-21", "1717-12-01", "Nommé maître de chapelle à Köthen — période la plus heureuse, compose les Brandebourgeois", "arts", "nomination", 5),
    ("1e260568-19cc-4cde-baed-f7d608d4c207", "Johann Sebastian Bach", "1685-03-21", "1723-05-22", "Nommé cantor à Leipzig — poste qu'il occupera 27 ans jusqu'à sa mort", "arts", "nomination", 4),
    ("1e260568-19cc-4cde-baed-f7d608d4c207", "Johann Sebastian Bach", "1685-03-21", "1729-04-15", "Dirige la première de la Passion selon saint Matthieu — sommet de la musique baroque", "arts", "creation", 5),
    ("1e260568-19cc-4cde-baed-f7d608d4c207", "Johann Sebastian Bach", "1685-03-21", "1747-05-07", "Visite Frédéric II de Prusse — improvise sur un thème du roi, compose L'Offrande musicale", "arts", "exploit", 5),
    ("1e260568-19cc-4cde-baed-f7d608d4c207", "Johann Sebastian Bach", "1685-03-21", "1750-07-28", "Meurt à Leipzig à 65 ans — réhabilité par Mendelssohn 79 ans plus tard", "arts", "mort", 5),
    # Franz Liszt (1811-10-22)
    ("5b00eb99-ab1b-4467-93a0-dae8c1bef205", "Franz Liszt", "1811-10-22", "1823-04-13", "Joue devant Beethoven à Vienne à 11 ans — le maître l'embrasse sur le front", "arts", "distinction", 5),
    ("5b00eb99-ab1b-4467-93a0-dae8c1bef205", "Franz Liszt", "1811-10-22", "1831-03-09", "Assiste au concert de Paganini à Paris — décide de devenir le Paganini du piano", "arts", "vie-privee", 5),
    ("5b00eb99-ab1b-4467-93a0-dae8c1bef205", "Franz Liszt", "1811-10-22", "1839-11-01", "Invente le récital de piano solo — premier musicien à jouer seul pendant 2 heures sur scène", "arts", "exploit", 5),
    ("5b00eb99-ab1b-4467-93a0-dae8c1bef205", "Franz Liszt", "1811-10-22", "1848-02-01", "Se retire des scènes — nommé directeur de la musique à Weimar, compose ses poèmes symphoniques", "arts", "nomination", 4),
    ("5b00eb99-ab1b-4467-93a0-dae8c1bef205", "Franz Liszt", "1811-10-22", "1865-04-25", "Reçoit les ordres mineurs de l'Église catholique — devient l'abbé Liszt", "spirituel", "conversion", 4),
    ("5b00eb99-ab1b-4467-93a0-dae8c1bef205", "Franz Liszt", "1811-10-22", "1886-07-31", "Meurt à Bayreuth à 74 ans — père de la musique de programme moderne", "arts", "mort", 5),
    # Franz Schubert (1797-01-31)
    ("e049714e-9d43-45ad-92c6-ceab29944d07", "Franz Schubert", "1797-01-31", "1813-10-28", "Compose sa première symphonie à 16 ans — élève du conservatoire de Vienne", "arts", "creation", 4),
    ("e049714e-9d43-45ad-92c6-ceab29944d07", "Franz Schubert", "1797-01-31", "1814-10-19", "Compose Gretchen am Spinnrade en une seule journée à 17 ans — révolution du lied", "arts", "creation", 5),
    ("e049714e-9d43-45ad-92c6-ceab29944d07", "Franz Schubert", "1797-01-31", "1815-01-01", "Compose 144 lieder en une seule année — productivité inouïe, dont Erlkönig en une heure", "arts", "creation", 5),
    ("e049714e-9d43-45ad-92c6-ceab29944d07", "Franz Schubert", "1797-01-31", "1822-01-01", "Compose la Symphonie inachevée — mystère sur les raisons de son abandon", "arts", "creation", 5),
    ("e049714e-9d43-45ad-92c6-ceab29944d07", "Franz Schubert", "1797-01-31", "1823-02-01", "Diagnostiqué syphilitique à 26 ans — sa santé décline rapidement", "arts", "vie-privee", 4),
    ("e049714e-9d43-45ad-92c6-ceab29944d07", "Franz Schubert", "1797-01-31", "1828-03-26", "Donne son unique concert public — succès total, trop tard pour changer sa vie", "arts", "exploit", 5),
    ("e049714e-9d43-45ad-92c6-ceab29944d07", "Franz Schubert", "1797-01-31", "1828-11-19", "Meurt à Vienne à 31 ans — 9e symphonie et quintette à cordes inachevés sur son bureau", "arts", "mort", 5),
    # Robert Schumann (1810-06-08)
    ("57da47e8-6c3c-4ca9-87d2-459ce872a8fd", "Robert Schumann", "1810-06-08", "1830-09-01", "Abandonne le droit pour la musique — sa mère cède, il rejoint le professeur Wieck", "arts", "debut", 4),
    ("57da47e8-6c3c-4ca9-87d2-459ce872a8fd", "Robert Schumann", "1810-06-08", "1832-01-01", "Se blesse la main droite avec un appareil d'exercice — fin de sa carrière de pianiste", "arts", "vie-privee", 5),
    ("57da47e8-6c3c-4ca9-87d2-459ce872a8fd", "Robert Schumann", "1810-06-08", "1840-09-12", "Épouse Clara Wieck malgré l'opposition de son père — année de l'amour, compose 138 lieder", "arts", "vie-privee", 5),
    ("57da47e8-6c3c-4ca9-87d2-459ce872a8fd", "Robert Schumann", "1810-06-08", "1843-04-01", "Fonde avec Mendelssohn le Conservatoire de Leipzig — institution musicale majeure", "arts", "creation", 4),
    ("57da47e8-6c3c-4ca9-87d2-459ce872a8fd", "Robert Schumann", "1810-06-08", "1853-10-01", "Découvre Brahms — lui prédit un grand avenir dans un article, dernier geste créatif lucide", "arts", "distinction", 5),
    ("57da47e8-6c3c-4ca9-87d2-459ce872a8fd", "Robert Schumann", "1810-06-08", "1856-07-29", "Meurt à 46 ans dans un asile — internalisé après une tentative de noyade dans le Rhin", "arts", "mort", 5),
    # Johannes Brahms (1833-05-07)
    ("e6ca0992-37ea-4ba2-b3ef-c427b4fb1fa9", "Johannes Brahms", "1833-05-07", "1853-09-30", "Rencontre Schumann — celui-ci publie un article dithyrambique, révèle Brahms au monde", "arts", "distinction", 5),
    ("e6ca0992-37ea-4ba2-b3ef-c427b4fb1fa9", "Johannes Brahms", "1833-05-07", "1868-04-10", "Crée le Requiem allemand à Brême — succès immense, il devient célèbre dans toute l'Europe", "arts", "creation", 5),
    ("e6ca0992-37ea-4ba2-b3ef-c427b4fb1fa9", "Johannes Brahms", "1833-05-07", "1876-11-04", "Crée sa 1e symphonie à 43 ans — après 20 ans de travail, craignant d'être comparé à Beethoven", "arts", "creation", 5),
    ("e6ca0992-37ea-4ba2-b3ef-c427b4fb1fa9", "Johannes Brahms", "1833-05-07", "1885-10-25", "Crée sa 4e symphonie — chef-d'oeuvre du classicisme romantique", "arts", "creation", 5),
    ("e6ca0992-37ea-4ba2-b3ef-c427b4fb1fa9", "Johannes Brahms", "1833-05-07", "1896-05-20", "Assiste aux funérailles de Clara Schumann — meurt lui-même 11 mois plus tard de cancer", "arts", "vie-privee", 4),
    ("e6ca0992-37ea-4ba2-b3ef-c427b4fb1fa9", "Johannes Brahms", "1833-05-07", "1897-04-03", "Meurt à Vienne à 63 ans — avait brûlé tous ses manuscrits inachevés peu avant", "arts", "mort", 5),
    # Claude Debussy (1862-08-22)
    ("2662c2dd-47cf-46c6-a479-f713d809bd43", "Claude Debussy", "1862-08-22", "1872-10-22", "Entre au Conservatoire de Paris à 10 ans — ses professeurs le trouvent trop original", "arts", "formation", 4),
    ("2662c2dd-47cf-46c6-a479-f713d809bd43", "Claude Debussy", "1862-08-22", "1884-07-01", "Remporte le Prix de Rome — séjourne à la Villa Médicis, découvre Wagner à Bayreuth", "arts", "distinction", 5),
    ("2662c2dd-47cf-46c6-a479-f713d809bd43", "Claude Debussy", "1862-08-22", "1889-05-01", "Découvre la musique javanaise à l'Exposition universelle — révolution sonore dans sa tête", "arts", "vie-privee", 5),
    ("2662c2dd-47cf-46c6-a479-f713d809bd43", "Claude Debussy", "1862-08-22", "1894-12-22", "Crée le Prélude à l'après-midi d'un faune — naissance de la musique impressionniste", "arts", "creation", 5),
    ("2662c2dd-47cf-46c6-a479-f713d809bd43", "Claude Debussy", "1862-08-22", "1902-04-30", "Crée Pelléas et Mélisande — opéra révolutionnaire, scandale puis triomphe", "arts", "creation", 5),
    ("2662c2dd-47cf-46c6-a479-f713d809bd43", "Claude Debussy", "1862-08-22", "1918-03-25", "Meurt à Paris à 55 ans pendant le bombardement allemand — soigné pour un cancer du rectum", "arts", "mort", 5),
    # Maurice Ravel (1875-03-07)
    ("00acbf7f-f44f-4072-948d-7dff0fc6fe0b", "Maurice Ravel", "1875-03-07", "1900-05-01", "Échoue pour la 3e fois au Prix de Rome — scandale national, réforme du Conservatoire", "arts", "vie-privee", 4),
    ("00acbf7f-f44f-4072-948d-7dff0fc6fe0b", "Maurice Ravel", "1875-03-07", "1905-04-16", "Crée la Pavane pour une infante défunte — premier grand succès public", "arts", "creation", 4),
    ("00acbf7f-f44f-4072-948d-7dff0fc6fe0b", "Maurice Ravel", "1875-03-07", "1911-05-29", "Crée Daphnis et Chloé pour les Ballets russes de Diaghilev — collaboration historique", "arts", "creation", 5),
    ("00acbf7f-f44f-4072-948d-7dff0fc6fe0b", "Maurice Ravel", "1875-03-07", "1928-01-20", "Crée le Boléro à l'Opéra de Paris — succès mondial immédiat, il en sera agacé toute sa vie", "arts", "creation", 5),
    ("00acbf7f-f44f-4072-948d-7dff0fc6fe0b", "Maurice Ravel", "1875-03-07", "1932-10-28", "Accident de taxi — traumatisme crânien, perd progressivement ses facultés mentales", "arts", "vie-privee", 5),
    ("00acbf7f-f44f-4072-948d-7dff0fc6fe0b", "Maurice Ravel", "1875-03-07", "1937-12-28", "Meurt à Paris à 62 ans après une opération cérébrale — ne reconnait plus sa propre musique", "arts", "mort", 5),
    # Salvador Dalí (1904-05-11)
    ("c546dcd4-fe4a-4dd8-9d72-98a1b2b7f868", "Salvador Dalí", "1904-05-11", "1922-09-01", "Entre à l'Académie des Beaux-Arts de Madrid — rencontre Lorca et Buñuel", "arts", "formation", 4),
    ("c546dcd4-fe4a-4dd8-9d72-98a1b2b7f868", "Salvador Dalí", "1904-05-11", "1926-10-20", "Renvoyé de l'Académie — refuse de passer son examen final, les juges indignes selon lui", "arts", "vie-privee", 4),
    ("c546dcd4-fe4a-4dd8-9d72-98a1b2b7f868", "Salvador Dalí", "1904-05-11", "1929-06-01", "Rencontre Gala — elle deviendra sa muse, manager et épouse pour 50 ans", "arts", "rencontre", 5),
    ("c546dcd4-fe4a-4dd8-9d72-98a1b2b7f868", "Salvador Dalí", "1904-05-11", "1931-06-01", "Peint La Persistance de la mémoire — les montres molles, icône du surréalisme mondial", "arts", "creation", 5),
    ("c546dcd4-fe4a-4dd8-9d72-98a1b2b7f868", "Salvador Dalí", "1904-05-11", "1940-08-01", "Fuit en Amérique — 8 ans à New York, devient une star mondiale de la culture pop", "arts", "exil", 4),
    ("c546dcd4-fe4a-4dd8-9d72-98a1b2b7f868", "Salvador Dalí", "1904-05-11", "1974-09-28", "Ouvre le Théâtre-Musée Dalí à Figueres — le musée le plus visité d'Espagne", "arts", "creation", 5),
    ("c546dcd4-fe4a-4dd8-9d72-98a1b2b7f868", "Salvador Dalí", "1904-05-11", "1989-01-23", "Meurt à 84 ans — enterré sous la scène de son musée à Figueres, comme il l'avait demandé", "arts", "mort", 5),
    # Francisco de Goya (1746-03-30)
    ("beeb3afe-312a-4526-91ce-cdcf716219c0", "Francisco de Goya", "1746-03-30", "1773-07-25", "Épouse Josefa Bayeu — entre dans la famille d'un peintre royal influent", "arts", "vie-privee", 3),
    ("beeb3afe-312a-4526-91ce-cdcf716219c0", "Francisco de Goya", "1746-03-30", "1786-06-25", "Nommé peintre du roi Charles III — accède à la cour d'Espagne", "arts", "nomination", 4),
    ("beeb3afe-312a-4526-91ce-cdcf716219c0", "Francisco de Goya", "1746-03-30", "1792-01-01", "Devient sourd à 46 ans après une grave maladie — sa peinture devient plus sombre et visionnaire", "arts", "vie-privee", 5),
    ("beeb3afe-312a-4526-91ce-cdcf716219c0", "Francisco de Goya", "1746-03-30", "1799-02-06", "Publie Los Caprichos — 80 gravures satiriques dénonçant la superstition et l'Inquisition", "arts", "publication", 5),
    ("beeb3afe-312a-4526-91ce-cdcf716219c0", "Francisco de Goya", "1746-03-30", "1814-02-24", "Peint Le 3 Mai 1808 — témoignage bouleversant des fusillades napoléoniennes", "arts", "creation", 5),
    ("beeb3afe-312a-4526-91ce-cdcf716219c0", "Francisco de Goya", "1746-03-30", "1823-01-01", "Peint les Peintures noires sur les murs de sa maison — chef-d'oeuvre visionnaire et sombre", "arts", "creation", 5),
    ("beeb3afe-312a-4526-91ce-cdcf716219c0", "Francisco de Goya", "1746-03-30", "1828-04-16", "Meurt à Bordeaux en exil à 82 ans — père de la peinture moderne", "arts", "mort", 5),
    # Auguste Rodin (1840-11-12)
    ("089520a5-d436-4379-8fb4-c8d1161a217c", "Auguste Rodin", "1840-11-12", "1857-01-01", "Refusé trois fois par l'École des Beaux-Arts — apprend son métier dans des ateliers privés", "arts", "formation", 4),
    ("089520a5-d436-4379-8fb4-c8d1161a217c", "Auguste Rodin", "1840-11-12", "1877-03-01", "Présente L'Age d'airain au Salon — accusé d'avoir moulé sur un vrai corps, scandale", "arts", "creation", 5),
    ("089520a5-d436-4379-8fb4-c8d1161a217c", "Auguste Rodin", "1840-11-12", "1880-08-16", "Reçoit la commande de La Porte de l'Enfer — travaillera dessus 37 ans sans l'achever", "arts", "creation", 5),
    ("089520a5-d436-4379-8fb4-c8d1161a217c", "Auguste Rodin", "1840-11-12", "1884-01-01", "Commence Les Bourgeois de Calais — six ans de travail pour ce chef-d'oeuvre de compassion", "arts", "creation", 5),
    ("089520a5-d436-4379-8fb4-c8d1161a217c", "Auguste Rodin", "1840-11-12", "1900-06-01", "Expose 168 oeuvres dans son propre pavillon à l'Exposition universelle — triomphe mondial", "arts", "distinction", 5),
    ("089520a5-d436-4379-8fb4-c8d1161a217c", "Auguste Rodin", "1840-11-12", "1917-11-17", "Meurt à 77 ans à Meudon — enterré sous son Penseur dans son jardin", "arts", "mort", 5),
]

def main():
    print("🔌 Connexion à Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    print("📋 Récupération des événements existants...")
    existing = set()
    offset = 0
    while True:
        batch = supabase.table("events").select("person_name, event_date_raw").range(offset, offset + 999).execute()
        for row in batch.data:
            existing.add((row["person_name"], row["event_date_raw"]))
        if len(batch.data) < 1000:
            break
        offset += 1000
    print(f"   → {len(existing)} événements déjà en base")

    to_insert = []
    skipped = 0
    for e in NEW_EVENTS:
        pid, pname, birth, event_date, desc, cat, subcat, imp = e
        if (pname, event_date) in existing:
            skipped += 1
            continue
        age_days, y, m, d, age_label = compute_age(birth, event_date)
        to_insert.append({
            "person_id": pid, "person_name": pname, "event_date_raw": event_date,
            "person_age_days": age_days, "age_years": y, "age_months": m,
            "age_days_rem": d, "age_label": age_label, "description_fr": desc,
            "category": cat, "subcategory": subcat, "importance": imp,
        })

    print(f"\n📊 Résumé :")
    print(f"   → {len(to_insert)} événements à insérer")
    print(f"   → {skipped} doublons ignorés")

    if not to_insert:
        print("✅ Rien à insérer.")
        return

    total = 0
    for i in range(0, len(to_insert), 50):
        batch = to_insert[i:i + 50]
        supabase.table("events").insert(batch).execute()
        total += len(batch)
        print(f"   ✅ Lot {i // 50 + 1} inséré ({len(batch)} événements)")

    print(f"\n🎉 Terminé ! {total} événements ajoutés en base.")

if __name__ == "__main__":
    main()

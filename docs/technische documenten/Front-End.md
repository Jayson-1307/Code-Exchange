# Technische documentatie

## Inhoudsopgaven
1. [Wat willen wij met dit document laten zien](#wat-willen-wij-met-dit-document-laten-zien)
4. [Front-end](#front-end)
    1. [LESS](#less)
    2. [Bootstrap](#bootstrap)
    3. [Navbar](#navbar)
    4. [Searchbar(WIP)](#searchbar-wip)
    5. [Media queries](#media-queries-css)



## Wat willen wij met dit document laten zien
Het doel van dit document is om andere uitleg te geven, over hoe ons project in elkaar zit en werkt.

Dit document is in andere documenten uitgespreid, zodat het overzichtelijk blijft zonder dat te veel onderdelen op één pagina staan en het onoverzichtelijk wordt.
Klik hieronder op de gewenste onderdeel.
* [Technische documentatie](../technische%20documentatie.md)
* [Database](./Database.md)
* [Classen](./Classen.md)
* [Front-End](./Front-End.md)

## Front-end
Hieronder kommen de onderdelen: <!-- Ontwerp gedachte,  -->LESS, Bootstrap, Navbar, Vraag toevoegen en search bar . 
Voor de uitleg van de aangegeven zal ik code snippets, images en uitleg in eigen woorden gebruiken.

### LESS
Binnen dit project hebben we ervoor gekozen om LESS te gebruiken om de website te stylen. Maar wat is LESS? LESS is een extention van CSS, wat de code makkelijker en efficienter maakt. Dit komt doordat je gebruik kan maken van variabelen, nesting en mixins. Nesting in CSS betekent dat je stijlregels binnen andere regels plaatst om de opmaak van specifieke elementen te organiseren. Mixins zijn herbruikbare codeblokken in CSS voor toepassing van meerdere stijlregels op verschillende elementen (hier heb ik momenteel nog geen voorbeeld van). Deze dingen besparen je (vooral in grote projecten) niet alleen veel tijd, maar ook scheelt ook lines aan code. 

**Voorbeeld LESS variabel**    
```LESS
@main-color: #fcf9e7;
```

**Voorbeeld oproep LESS variabel**    
```LESS
background-color: @main-color;
```

**Voorbeeld Nesting in LESS**    
```LESS
.nav-item {
        list-style: none;
        padding: 0 10px;
        
        a.nav-link {
            color: @light-text-color;
        }
    
        &.active a.nav-link {
            color: @text-color;
            border-bottom: 5px solid @highlight-color;
        }
    
        &.account {
            margin-left: auto;
            padding: 0;
        }
    }
```   
<br>

### Bootstrap
Om makkelijk blokken die al gestyled, responsive en (deels) functioneel zijn te plaatsen op de website, gebruiken we Bootstrap. Dit is scheelt heel erg veel tijd, aangezien je dingen zoals een navbar niet meer vanaf scratch hoeft te schrijven. Bootstrap werkt door de aangewezen links (te vinden op de bootstrap website), te plaatsen in de HTML bestanden waarbinnen je Bootstrap wilt gebruiken. Als je dit hebt gedaan kan je naar de website gaan en zoeken naar dingen die je wilt gebruiken. Dit kan je dan kopiëren en in je bestand plakken op de gewenste plek, en dan heb je een volledige gestyled en responsive blok op je website. 

**Hoe Bootstrap word opgeroepen ("link" in head, "Script" onderaan body)**
```HTML
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

```
<br>

### Navbar
De navbar op onze website komt van bootstrap, en is daarna met LESS naar onze wens gemaakt. De classes die zijn toegewezen aan de HTML elementen zijn zodat de bootstrap styling en functionaliteiten kunnen worden toegepast. Door die zelfde classes aan te spreken in LESS, kunnen wij deze blokken naar onze wens aanpassen. Een specifieke class genaamd 'active', maakt het mogelijk om het blok met die class apart te stylen. Dit is erg handig om op de website te kunnen tonen op welke pagina de gebruiker op dat moment is.

**HTML voor de navbar**
```HTML
<nav class="navbar navbar-expand-lg navbar-light">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
                          
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="questions.html">Questions</a>
            </li>
            <form class="form-inline my-2 my-lg-0">
                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
            <li class="nav-item account">
                <span id="profile" class="nav-link profile">Profile</span>
            </li>
        </ul>
    </div>
</nav>
```   

**Extra LESS code om navbar naar eigen wens te maken**
```LESS
ul.navbar-nav {
    width: 100%;

    .nav-item {
        list-style: none;
        padding: 0 10px;
        
        a.nav-link {
            color: @light-text-color;
        }
    
        &.active a.nav-link {
            color: @text-color;
            border-bottom: 5px solid @highlight-color;
        }
    
        &.account {
            margin-left: auto;
            padding: 0;
        }
    }
}
```
<br>

### Searchbar (WIP)
In de navbar is er een search bar te vinden. Deze is geplaatst door middel van bootstrap, en daarna aangepast naar wens met eigen LESS code. Zoals vermeld is dit nog een work in progress,en is het op kleinere schermen nu nog niet zichtbaar. 

**HTML voor de searchbar**
```HTML
<form class="form-inline my-2 my-lg-0">
    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
</form>
```

**Extra LESS code om searchbar naar wens te maken** 
```LESS
 .form-inline {
    display: none;
                
    @media screen and (min-width: @screen-lg-min) {
        display: flex;
        flex-wrap: nowrap;
        flex: 1;
        margin: 0 20px;
    }
        
    .form-control {
        width: 100%;
    }
        
    button {
        color: @main-color;
        border-color: @accent-color;
        background-color: @accent-color;
            
        &:hover {
            background-color: @button-hover-color;
            border-color: @button-hover-color;
        }
    }  
}
```
<br>

### Media queries (CSS)
Om elementen op handmatige manier responsive te maken gebruiken we 'media queries'. Media queries worden gebruikt in CSS om zogenaamde 'breakpoints' aan te geven en op basis hiervan blokken styling te geven. Wil jij bijvoorbeeld dat een font size kleiner word wanneer het scherm kleiner is dan 500px, dan kan je dat aangeven met een media query. Hieronder zullen een paar media queries volgen die wij gebruiken op de website.

**Voorbeeld van media query waarvan de code ingaat wanneer het scherm minimaal 992 pixels breed is**
```LESS
@screen-lg-min: 992px;

@media screen and (min-width: @screen-lg-min) {
    display: flex;
    flex-wrap: nowrap;
    flex: 1;
    margin: 0 20px;
}
```   

**Voorbeeld van media query waar de geselecteerde blokken, bepaalde styling mee moet krijgen als het beeld maximaal 991px breed is**
```LESS
@screen-md-max: 991px;

@media screen and (max-width: @screen-md-max) {
    .navbar {
        justify-content: end;
    }
    ul.navbar-nav li{
        width: fit-content;
        margin-left: auto;
        text-align: right;

        a {
            width: fit-content;
        }
    }
}
```

## Bronnen








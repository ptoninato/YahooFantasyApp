PGDMP                         x           YahooFantasy    12.3    12.3 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16393    YahooFantasy    DATABASE     l   CREATE DATABASE "YahooFantasy" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';
    DROP DATABASE "YahooFantasy";
                postgres    false                        2615    16394 
   LeagueType    SCHEMA        CREATE SCHEMA "LeagueType";
    DROP SCHEMA "LeagueType";
                postgres    false                        1259    33343    draft    TABLE     �   CREATE TABLE public.draft (
    draftid integer NOT NULL,
    seasonid integer NOT NULL,
    auctiondraft boolean DEFAULT false NOT NULL,
    keeperdraft boolean DEFAULT false NOT NULL
);
    DROP TABLE public.draft;
       public         heap    postgres    false            �            1259    33341    draft_draftid_seq    SEQUENCE     �   CREATE SEQUENCE public.draft_draftid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.draft_draftid_seq;
       public          postgres    false    256            �           0    0    draft_draftid_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.draft_draftid_seq OWNED BY public.draft.draftid;
          public          postgres    false    255                       1259    33358 	   draftpick    TABLE     G  CREATE TABLE public.draftpick (
    draftpickid integer NOT NULL,
    draftid integer NOT NULL,
    round integer NOT NULL,
    pick integer NOT NULL,
    playerid integer NOT NULL,
    cost numeric,
    keeper boolean DEFAULT false NOT NULL,
    randymoss boolean DEFAULT false NOT NULL,
    fantasyteamid integer NOT NULL
);
    DROP TABLE public.draftpick;
       public         heap    postgres    false                       1259    33356    draftpick_draftpickid_seq    SEQUENCE     �   CREATE SEQUENCE public.draftpick_draftpickid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.draftpick_draftpickid_seq;
       public          postgres    false    258            �           0    0    draftpick_draftpickid_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.draftpick_draftpickid_seq OWNED BY public.draftpick.draftpickid;
          public          postgres    false    257            �            1259    24810    fantasyteam    TABLE     �  CREATE TABLE public.fantasyteam (
    fantasyteamid integer NOT NULL,
    leagueid integer NOT NULL,
    seasonid integer NOT NULL,
    ownerid integer NOT NULL,
    yahooteamid integer NOT NULL,
    teamname character varying(25) NOT NULL,
    teamurl character varying(1000),
    teamlogo character varying(1000),
    moves integer,
    trades integer,
    rank integer,
    wins integer,
    losses integer,
    ties integer,
    percentage numeric,
    gamesback numeric,
    rosteradds integer,
    gradeid integer,
    clinchedplayoffs boolean,
    playoffseed integer,
    pointsfor numeric,
    pointsagainst numeric,
    pointsback numeric
);
    DROP TABLE public.fantasyteam;
       public         heap    postgres    false            �            1259    24808    fantasyteam_teamid_seq    SEQUENCE     �   CREATE SEQUENCE public.fantasyteam_teamid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.fantasyteam_teamid_seq;
       public          postgres    false    210            �           0    0    fantasyteam_teamid_seq    SEQUENCE OWNED BY     X   ALTER SEQUENCE public.fantasyteam_teamid_seq OWNED BY public.fantasyteam.fantasyteamid;
          public          postgres    false    209            �            1259    16449    gamecode    TABLE     �   CREATE TABLE public.gamecode (
    gamecodeid integer NOT NULL,
    gamecodetypeid integer NOT NULL,
    yahoogamecode character varying(50),
    season character(20)
);
    DROP TABLE public.gamecode;
       public         heap    postgres    false            �            1259    16447    gamecode_gamecodeid_seq    SEQUENCE     �   CREATE SEQUENCE public.gamecode_gamecodeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.gamecode_gamecodeid_seq;
       public          postgres    false    206            �           0    0    gamecode_gamecodeid_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.gamecode_gamecodeid_seq OWNED BY public.gamecode.gamecodeid;
          public          postgres    false    205            �            1259    16409    gamecodetype    TABLE     �   CREATE TABLE public.gamecodetype (
    gamecodetypeid integer NOT NULL,
    yahoogamename character varying(50),
    yahoogamecode character varying(50)
);
     DROP TABLE public.gamecodetype;
       public         heap    postgres    false            �            1259    16407    gamecodetype_gamecodeid_seq    SEQUENCE     �   CREATE SEQUENCE public.gamecodetype_gamecodeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.gamecodetype_gamecodeid_seq;
       public          postgres    false    204            �           0    0    gamecodetype_gamecodeid_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.gamecodetype_gamecodeid_seq OWNED BY public.gamecodetype.gamecodetypeid;
          public          postgres    false    203                       1259    33391 
   importlock    TABLE     N   CREATE TABLE public.importlock (
    locked boolean DEFAULT false NOT NULL
);
    DROP TABLE public.importlock;
       public         heap    postgres    false            �            1259    24592    league    TABLE     �   CREATE TABLE public.league (
    leaguename character varying(50) NOT NULL,
    gamecodetypeid integer NOT NULL,
    leagueid integer NOT NULL
);
    DROP TABLE public.league;
       public         heap    postgres    false            �            1259    24635    league_leagueid_seq    SEQUENCE     �   CREATE SEQUENCE public.league_leagueid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.league_leagueid_seq;
       public          postgres    false    207            �           0    0    league_leagueid_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.league_leagueid_seq OWNED BY public.league.leagueid;
          public          postgres    false    208            �            1259    25609    matchup    TABLE     �  CREATE TABLE public.matchup (
    matchupid integer NOT NULL,
    fantasyteamid1 integer NOT NULL,
    fantasyteamid2 integer NOT NULL,
    winningteamid integer,
    isplayoffs boolean DEFAULT false NOT NULL,
    isconsolation boolean DEFAULT false NOT NULL,
    seasonid integer NOT NULL,
    matchuprecap character varying(1000),
    matchuprecaptitle character varying(1000),
    seasonweekid integer NOT NULL,
    losingteamid integer,
    tie boolean DEFAULT false NOT NULL
);
    DROP TABLE public.matchup;
       public         heap    postgres    false            �            1259    25607    matchup_matchupid_seq    SEQUENCE     �   CREATE SEQUENCE public.matchup_matchupid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.matchup_matchupid_seq;
       public          postgres    false    241            �           0    0    matchup_matchupid_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.matchup_matchupid_seq OWNED BY public.matchup.matchupid;
          public          postgres    false    240            �            1259    25768    matchupcategoryresult    TABLE       CREATE TABLE public.matchupcategoryresult (
    matchupcategoryresultid integer NOT NULL,
    matchupid integer NOT NULL,
    seasonstatcategoryid integer NOT NULL,
    winningteamid integer,
    losingteamid integer,
    istied boolean DEFAULT false NOT NULL
);
 )   DROP TABLE public.matchupcategoryresult;
       public         heap    postgres    false            �            1259    25766 1   matchupcategoryresult_matchupcategoryresultid_seq    SEQUENCE     �   CREATE SEQUENCE public.matchupcategoryresult_matchupcategoryresultid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 H   DROP SEQUENCE public.matchupcategoryresult_matchupcategoryresultid_seq;
       public          postgres    false    247            �           0    0 1   matchupcategoryresult_matchupcategoryresultid_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.matchupcategoryresult_matchupcategoryresultid_seq OWNED BY public.matchupcategoryresult.matchupcategoryresultid;
          public          postgres    false    246            �            1259    25792    matchupcategoryteam    TABLE     �   CREATE TABLE public.matchupcategoryteam (
    matchupcategoryteamid integer NOT NULL,
    value character varying(25) NOT NULL,
    matchupteamid integer NOT NULL,
    seasonstatcategoryid integer NOT NULL
);
 '   DROP TABLE public.matchupcategoryteam;
       public         heap    postgres    false            �            1259    25790 -   matchupcategoryteam_matchupcategoryteamid_seq    SEQUENCE     �   CREATE SEQUENCE public.matchupcategoryteam_matchupcategoryteamid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 D   DROP SEQUENCE public.matchupcategoryteam_matchupcategoryteamid_seq;
       public          postgres    false    249            �           0    0 -   matchupcategoryteam_matchupcategoryteamid_seq    SEQUENCE OWNED BY        ALTER SEQUENCE public.matchupcategoryteam_matchupcategoryteamid_seq OWNED BY public.matchupcategoryteam.matchupcategoryteamid;
          public          postgres    false    248            �            1259    25711    matchupgradetype    TABLE     �   CREATE TABLE public.matchupgradetype (
    matchupgradetypeid integer NOT NULL,
    numericweight numeric,
    grade character varying(10) NOT NULL
);
 $   DROP TABLE public.matchupgradetype;
       public         heap    postgres    false            �            1259    25709 '   matchupgradetype_matchupgradetypeid_seq    SEQUENCE     �   CREATE SEQUENCE public.matchupgradetype_matchupgradetypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 >   DROP SEQUENCE public.matchupgradetype_matchupgradetypeid_seq;
       public          postgres    false    243            �           0    0 '   matchupgradetype_matchupgradetypeid_seq    SEQUENCE OWNED BY     s   ALTER SEQUENCE public.matchupgradetype_matchupgradetypeid_seq OWNED BY public.matchupgradetype.matchupgradetypeid;
          public          postgres    false    242            �            1259    25848    matchuproster    TABLE     �   CREATE TABLE public.matchuproster (
    matchuprosterid integer NOT NULL,
    matchupteamid integer NOT NULL,
    playerid integer NOT NULL,
    gamedate date,
    seasonpositionid integer NOT NULL
);
 !   DROP TABLE public.matchuproster;
       public         heap    postgres    false            �            1259    25846 !   matchuproster_matchuprosterid_seq    SEQUENCE     �   CREATE SEQUENCE public.matchuproster_matchuprosterid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.matchuproster_matchuprosterid_seq;
       public          postgres    false    251            �           0    0 !   matchuproster_matchuprosterid_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.matchuproster_matchuprosterid_seq OWNED BY public.matchuproster.matchuprosterid;
          public          postgres    false    250            �            1259    25866    matchuprosterplayerstat    TABLE     �   CREATE TABLE public.matchuprosterplayerstat (
    matchuprosterplayerstatid integer NOT NULL,
    matchuprosterid integer NOT NULL,
    seasonstatcategoryid integer NOT NULL,
    value character varying(50) NOT NULL
);
 +   DROP TABLE public.matchuprosterplayerstat;
       public         heap    postgres    false            �            1259    25864 5   matchuprosterplayerstat_matchuprosterplayerstatid_seq    SEQUENCE     �   CREATE SEQUENCE public.matchuprosterplayerstat_matchuprosterplayerstatid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 L   DROP SEQUENCE public.matchuprosterplayerstat_matchuprosterplayerstatid_seq;
       public          postgres    false    253            �           0    0 5   matchuprosterplayerstat_matchuprosterplayerstatid_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.matchuprosterplayerstat_matchuprosterplayerstatid_seq OWNED BY public.matchuprosterplayerstat.matchuprosterplayerstatid;
          public          postgres    false    252            �            1259    25724    matchupteam    TABLE     �   CREATE TABLE public.matchupteam (
    matchupteamid integer NOT NULL,
    matchupid integer NOT NULL,
    fantasyteamid integer,
    pointsfor numeric,
    projectedpointsfor numeric,
    tiedpoints numeric,
    matchupgradetypeid integer
);
    DROP TABLE public.matchupteam;
       public         heap    postgres    false            �            1259    25722    matchupteam_matchupteamid_seq    SEQUENCE     �   CREATE SEQUENCE public.matchupteam_matchupteamid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.matchupteam_matchupteamid_seq;
       public          postgres    false    245            �           0    0    matchupteam_matchupteamid_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.matchupteam_matchupteamid_seq OWNED BY public.matchupteam.matchupteamid;
          public          postgres    false    244            �            1259    25097    owner    TABLE     �   CREATE TABLE public.owner (
    ownerid integer NOT NULL,
    leagueid integer NOT NULL,
    ownername character varying(50) NOT NULL,
    email character varying(50),
    yahoomanagerid integer NOT NULL,
    yahooguid character varying(50) NOT NULL
);
    DROP TABLE public.owner;
       public         heap    postgres    false            �            1259    25095    owner_ownerid_seq    SEQUENCE     �   CREATE SEQUENCE public.owner_ownerid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.owner_ownerid_seq;
       public          postgres    false    214            �           0    0    owner_ownerid_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.owner_ownerid_seq OWNED BY public.owner.ownerid;
          public          postgres    false    213            �            1259    25118    player    TABLE       CREATE TABLE public.player (
    playerid integer NOT NULL,
    gamecodetypeid integer NOT NULL,
    yahooplayerid integer NOT NULL,
    firstname character varying(25) NOT NULL,
    lastname character varying(25) NOT NULL,
    positiontypeid integer NOT NULL
);
    DROP TABLE public.player;
       public         heap    postgres    false            �            1259    25116    player_playerid_seq    SEQUENCE     �   CREATE SEQUENCE public.player_playerid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.player_playerid_seq;
       public          postgres    false    216            �           0    0    player_playerid_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.player_playerid_seq OWNED BY public.player.playerid;
          public          postgres    false    215            �            1259    25434    rosterposition    TABLE     �   CREATE TABLE public.rosterposition (
    rosterpositionid integer NOT NULL,
    gamecodetypeid integer NOT NULL,
    positionname character varying(30) NOT NULL
);
 "   DROP TABLE public.rosterposition;
       public         heap    postgres    false            �            1259    25432    position_positionid_seq    SEQUENCE     �   CREATE SEQUENCE public.position_positionid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.position_positionid_seq;
       public          postgres    false    228            �           0    0    position_positionid_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.position_positionid_seq OWNED BY public.rosterposition.rosterpositionid;
          public          postgres    false    227            �            1259    25382    positiontype    TABLE     �   CREATE TABLE public.positiontype (
    positiontypeid integer NOT NULL,
    yahoopositiontype character varying(5) NOT NULL,
    gamecodetypeid integer NOT NULL
);
     DROP TABLE public.positiontype;
       public         heap    postgres    false            �            1259    25380    positiontype_positiontypeid_seq    SEQUENCE     �   CREATE SEQUENCE public.positiontype_positiontypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.positiontype_positiontypeid_seq;
       public          postgres    false    226            �           0    0    positiontype_positiontypeid_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.positiontype_positiontypeid_seq OWNED BY public.positiontype.positiontypeid;
          public          postgres    false    225            �            1259    24986    season    TABLE     �  CREATE TABLE public.season (
    seasonid integer NOT NULL,
    leagueid integer NOT NULL,
    gamecodeid integer NOT NULL,
    yahooleagueid integer NOT NULL,
    startdate date NOT NULL,
    enddate date NOT NULL,
    seasonyear character varying(10) NOT NULL,
    scoringtype character varying(25) NOT NULL,
    firstweek integer DEFAULT 1,
    lastweek integer,
    tradeenddate date,
    playoffstartweek integer
);
    DROP TABLE public.season;
       public         heap    postgres    false            �            1259    24984    season_seasonid_seq    SEQUENCE     �   CREATE SEQUENCE public.season_seasonid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.season_seasonid_seq;
       public          postgres    false    212            �           0    0    season_seasonid_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.season_seasonid_seq OWNED BY public.season.seasonid;
          public          postgres    false    211            �            1259    25287    seasonidleagueidyahoogamecode    VIEW        CREATE VIEW public.seasonidleagueidyahoogamecode AS
 SELECT s.seasonid,
    s.yahooleagueid,
    gc.yahoogamecode,
    gc.gamecodetypeid
   FROM (public.season s
     JOIN public.gamecode gc ON ((s.gamecodeid = gc.gamecodeid)))
  ORDER BY s.seasonid DESC;
 0   DROP VIEW public.seasonidleagueidyahoogamecode;
       public          postgres    false    206    212    212    212    206    206            �            1259    25447    seasonposition    TABLE     �   CREATE TABLE public.seasonposition (
    seasonpositionid integer NOT NULL,
    seasonid integer NOT NULL,
    rosterpositionid integer NOT NULL,
    count integer NOT NULL
);
 "   DROP TABLE public.seasonposition;
       public         heap    postgres    false            �            1259    25445 #   seasonposition_seasonpositionid_seq    SEQUENCE     �   CREATE SEQUENCE public.seasonposition_seasonpositionid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.seasonposition_seasonpositionid_seq;
       public          postgres    false    230            �           0    0 #   seasonposition_seasonpositionid_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.seasonposition_seasonpositionid_seq OWNED BY public.seasonposition.seasonpositionid;
          public          postgres    false    229            �            1259    25491    seasonstatcategory    TABLE     �   CREATE TABLE public.seasonstatcategory (
    seasonstatcategoryid integer NOT NULL,
    seasonstatcategorytypeid integer NOT NULL,
    seasonid integer NOT NULL,
    enabled boolean NOT NULL
);
 &   DROP TABLE public.seasonstatcategory;
       public         heap    postgres    false            �            1259    25489 )   seasonstatcategory_seasonstatcategory_seq    SEQUENCE     �   CREATE SEQUENCE public.seasonstatcategory_seasonstatcategory_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 @   DROP SEQUENCE public.seasonstatcategory_seasonstatcategory_seq;
       public          postgres    false    234            �           0    0 )   seasonstatcategory_seasonstatcategory_seq    SEQUENCE OWNED BY     y   ALTER SEQUENCE public.seasonstatcategory_seasonstatcategory_seq OWNED BY public.seasonstatcategory.seasonstatcategoryid;
          public          postgres    false    233            �            1259    25473    seasonstatcategorytype    TABLE     )  CREATE TABLE public.seasonstatcategorytype (
    seasonstatcategorytypeid integer NOT NULL,
    yahoocategoryid integer NOT NULL,
    name character varying(100) NOT NULL,
    displayname character varying(100) NOT NULL,
    gamecodetypeid integer NOT NULL,
    positiontypeid integer NOT NULL
);
 *   DROP TABLE public.seasonstatcategorytype;
       public         heap    postgres    false            �            1259    25471 3   seasonstatcategorytype_seasonstatcategorytypeid_seq    SEQUENCE     �   CREATE SEQUENCE public.seasonstatcategorytype_seasonstatcategorytypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 J   DROP SEQUENCE public.seasonstatcategorytype_seasonstatcategorytypeid_seq;
       public          postgres    false    232            �           0    0 3   seasonstatcategorytype_seasonstatcategorytypeid_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE public.seasonstatcategorytype_seasonstatcategorytypeid_seq OWNED BY public.seasonstatcategorytype.seasonstatcategorytypeid;
          public          postgres    false    231            �            1259    25520    seasonstatmodifier    TABLE     �   CREATE TABLE public.seasonstatmodifier (
    seasonstatmodifierid integer NOT NULL,
    seasonstatcategoryid integer NOT NULL,
    value numeric NOT NULL
);
 &   DROP TABLE public.seasonstatmodifier;
       public         heap    postgres    false            �            1259    25518 +   seasonstatmodifier_seasonstatmodifierid_seq    SEQUENCE     �   CREATE SEQUENCE public.seasonstatmodifier_seasonstatmodifierid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 B   DROP SEQUENCE public.seasonstatmodifier_seasonstatmodifierid_seq;
       public          postgres    false    236            �           0    0 +   seasonstatmodifier_seasonstatmodifierid_seq    SEQUENCE OWNED BY     {   ALTER SEQUENCE public.seasonstatmodifier_seasonstatmodifierid_seq OWNED BY public.seasonstatmodifier.seasonstatmodifierid;
          public          postgres    false    235            �            1259    25586 
   seasonweek    TABLE     �   CREATE TABLE public.seasonweek (
    seasonweekid integer NOT NULL,
    seasonid integer NOT NULL,
    weeknumber integer NOT NULL,
    startdate date NOT NULL,
    enddate date NOT NULL,
    ispostseason boolean DEFAULT false NOT NULL
);
    DROP TABLE public.seasonweek;
       public         heap    postgres    false            �            1259    25584    seasonweek_seasonweekid_seq    SEQUENCE     �   CREATE SEQUENCE public.seasonweek_seasonweekid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.seasonweek_seasonweekid_seq;
       public          postgres    false    239            �           0    0    seasonweek_seasonweekid_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.seasonweek_seasonweekid_seq OWNED BY public.seasonweek.seasonweekid;
          public          postgres    false    238            �            1259    25321    transaction    TABLE     R  CREATE TABLE public.transaction (
    transactionid integer NOT NULL,
    seasonid integer NOT NULL,
    fantasyteamid integer NOT NULL,
    tradefromteamid integer,
    playerid integer NOT NULL,
    transactiontypeid integer NOT NULL,
    yahootransactionid integer NOT NULL,
    transactiondate timestamp without time zone NOT NULL
);
    DROP TABLE public.transaction;
       public         heap    postgres    false            �            1259    25319    transaction_transactionid_seq    SEQUENCE     �   CREATE SEQUENCE public.transaction_transactionid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.transaction_transactionid_seq;
       public          postgres    false    223            �           0    0    transaction_transactionid_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE public.transaction_transactionid_seq OWNED BY public.transaction.transactionid;
          public          postgres    false    222            �            1259    25573    transactioncounts    VIEW     P  CREATE VIEW public.transactioncounts AS
 SELECT t.playerid,
    p2.yahoopositiontype,
    p.firstname,
    p.lastname,
    count(*) AS ct,
    rank() OVER (ORDER BY (count(*)) DESC) AS rank_number
   FROM (((public.transaction t
     JOIN public.player p ON ((t.playerid = p.playerid)))
     JOIN public.gamecodetype gct ON ((p.gamecodetypeid = gct.gamecodetypeid)))
     JOIN public.positiontype p2 ON ((p2.positiontypeid = p.positiontypeid)))
  WHERE ((gct.yahoogamecode)::text = 'mlb'::text)
  GROUP BY t.playerid, p.firstname, p.lastname, p2.yahoopositiontype
  ORDER BY (count(*)) DESC;
 $   DROP VIEW public.transactioncounts;
       public          postgres    false    226    226    223    216    216    216    216    216    204    204            �            1259    25369    transactioncountsnfl    VIEW     �  CREATE VIEW public.transactioncountsnfl AS
 SELECT t.playerid,
    p.firstname,
    p.lastname,
    count(*) AS ct,
    rank() OVER (ORDER BY (count(*)) DESC) AS rank_number
   FROM ((public.transaction t
     JOIN public.player p ON ((t.playerid = p.playerid)))
     JOIN public.gamecodetype gct ON ((p.gamecodetypeid = gct.gamecodetypeid)))
  WHERE ((gct.yahoogamecode)::text = 'nfl'::text)
  GROUP BY t.playerid, p.firstname, p.lastname
  ORDER BY (count(*)) DESC;
 '   DROP VIEW public.transactioncountsnfl;
       public          postgres    false    204    216    216    216    223    216    204            �            1259    25137    transactiontype    TABLE        CREATE TABLE public.transactiontype (
    transactiontypeid integer NOT NULL,
    transactiontypename character varying(10)
);
 #   DROP TABLE public.transactiontype;
       public         heap    postgres    false            �            1259    25135 %   transactiontype_transactiontypeid_seq    SEQUENCE     �   CREATE SEQUENCE public.transactiontype_transactiontypeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 <   DROP SEQUENCE public.transactiontype_transactiontypeid_seq;
       public          postgres    false    219            �           0    0 %   transactiontype_transactiontypeid_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE public.transactiontype_transactiontypeid_seq OWNED BY public.transactiontype.transactiontypeid;
          public          postgres    false    218            �            1259    33332    yahooleagueandteamcodes    VIEW     $  CREATE VIEW public.yahooleagueandteamcodes AS
 SELECT m.matchupteamid,
    s2.weeknumber,
    s2.startdate,
    s2.enddate,
    g2.gamecodeid,
    g2.gamecodetypeid,
    g3.yahoogamecode,
    s3.yahooleagueid,
    concat(g2.yahoogamecode, '.l.', s3.yahooleagueid, '.t.', f.yahooteamid) AS yahooteamcode
   FROM ((((((public.matchupteam m
     JOIN public.matchup m2 ON ((m.matchupid = m2.matchupid)))
     JOIN public.seasonweek s2 ON ((m2.seasonweekid = s2.seasonweekid)))
     JOIN public.season s3 ON ((s2.seasonid = s3.seasonid)))
     JOIN public.gamecode g2 ON ((s3.gamecodeid = g2.gamecodeid)))
     JOIN public.gamecodetype g3 ON ((g2.gamecodetypeid = g3.gamecodetypeid)))
     JOIN public.fantasyteam f ON ((m.fantasyteamid = f.fantasyteamid)))
  WHERE ((g3.yahoogamecode)::text = 'nfl'::text);
 *   DROP VIEW public.yahooleagueandteamcodes;
       public          postgres    false    212    204    204    206    206    206    210    210    212    212    239    239    239    239    239    241    241    245    245    245            �            1259    25130    yahooleaguecode    VIEW     W  CREATE VIEW public.yahooleaguecode AS
 SELECT concat(gc.yahoogamecode, '.l.', s.yahooleagueid) AS leaguecode,
    s.seasonyear AS season,
    l.leaguename AS name
   FROM ((public.season s
     JOIN public.gamecode gc ON ((s.gamecodeid = gc.gamecodeid)))
     JOIN public.league l ON ((s.leagueid = l.leagueid)))
  ORDER BY s.seasonyear DESC;
 "   DROP VIEW public.yahooleaguecode;
       public          postgres    false    212    212    212    212    207    206    206    207            �            1259    25282    yahooteamkeys    VIEW     E  CREATE VIEW public.yahooteamkeys AS
 SELECT concat(gc.yahoogamecode, '.l.', s.yahooleagueid, '.t.', ft.yahooteamid) AS team_key,
    ft.fantasyteamid,
    ft.teamname
   FROM ((public.fantasyteam ft
     JOIN public.season s ON ((s.seasonid = ft.seasonid)))
     JOIN public.gamecode gc ON ((gc.gamecodeid = s.gamecodeid)));
     DROP VIEW public.yahooteamkeys;
       public          postgres    false    210    212    212    212    206    206    210    210    210            �           2604    33346    draft draftid    DEFAULT     n   ALTER TABLE ONLY public.draft ALTER COLUMN draftid SET DEFAULT nextval('public.draft_draftid_seq'::regclass);
 <   ALTER TABLE public.draft ALTER COLUMN draftid DROP DEFAULT;
       public          postgres    false    255    256    256            �           2604    33361    draftpick draftpickid    DEFAULT     ~   ALTER TABLE ONLY public.draftpick ALTER COLUMN draftpickid SET DEFAULT nextval('public.draftpick_draftpickid_seq'::regclass);
 D   ALTER TABLE public.draftpick ALTER COLUMN draftpickid DROP DEFAULT;
       public          postgres    false    258    257    258            t           2604    24813    fantasyteam fantasyteamid    DEFAULT        ALTER TABLE ONLY public.fantasyteam ALTER COLUMN fantasyteamid SET DEFAULT nextval('public.fantasyteam_teamid_seq'::regclass);
 H   ALTER TABLE public.fantasyteam ALTER COLUMN fantasyteamid DROP DEFAULT;
       public          postgres    false    210    209    210            r           2604    16452    gamecode gamecodeid    DEFAULT     z   ALTER TABLE ONLY public.gamecode ALTER COLUMN gamecodeid SET DEFAULT nextval('public.gamecode_gamecodeid_seq'::regclass);
 B   ALTER TABLE public.gamecode ALTER COLUMN gamecodeid DROP DEFAULT;
       public          postgres    false    206    205    206            q           2604    16412    gamecodetype gamecodetypeid    DEFAULT     �   ALTER TABLE ONLY public.gamecodetype ALTER COLUMN gamecodetypeid SET DEFAULT nextval('public.gamecodetype_gamecodeid_seq'::regclass);
 J   ALTER TABLE public.gamecodetype ALTER COLUMN gamecodetypeid DROP DEFAULT;
       public          postgres    false    203    204    204            s           2604    24637    league leagueid    DEFAULT     r   ALTER TABLE ONLY public.league ALTER COLUMN leagueid SET DEFAULT nextval('public.league_leagueid_seq'::regclass);
 >   ALTER TABLE public.league ALTER COLUMN leagueid DROP DEFAULT;
       public          postgres    false    208    207            �           2604    25612    matchup matchupid    DEFAULT     v   ALTER TABLE ONLY public.matchup ALTER COLUMN matchupid SET DEFAULT nextval('public.matchup_matchupid_seq'::regclass);
 @   ALTER TABLE public.matchup ALTER COLUMN matchupid DROP DEFAULT;
       public          postgres    false    241    240    241            �           2604    25771 -   matchupcategoryresult matchupcategoryresultid    DEFAULT     �   ALTER TABLE ONLY public.matchupcategoryresult ALTER COLUMN matchupcategoryresultid SET DEFAULT nextval('public.matchupcategoryresult_matchupcategoryresultid_seq'::regclass);
 \   ALTER TABLE public.matchupcategoryresult ALTER COLUMN matchupcategoryresultid DROP DEFAULT;
       public          postgres    false    246    247    247            �           2604    25795 )   matchupcategoryteam matchupcategoryteamid    DEFAULT     �   ALTER TABLE ONLY public.matchupcategoryteam ALTER COLUMN matchupcategoryteamid SET DEFAULT nextval('public.matchupcategoryteam_matchupcategoryteamid_seq'::regclass);
 X   ALTER TABLE public.matchupcategoryteam ALTER COLUMN matchupcategoryteamid DROP DEFAULT;
       public          postgres    false    249    248    249            �           2604    25714 #   matchupgradetype matchupgradetypeid    DEFAULT     �   ALTER TABLE ONLY public.matchupgradetype ALTER COLUMN matchupgradetypeid SET DEFAULT nextval('public.matchupgradetype_matchupgradetypeid_seq'::regclass);
 R   ALTER TABLE public.matchupgradetype ALTER COLUMN matchupgradetypeid DROP DEFAULT;
       public          postgres    false    243    242    243            �           2604    25851    matchuproster matchuprosterid    DEFAULT     �   ALTER TABLE ONLY public.matchuproster ALTER COLUMN matchuprosterid SET DEFAULT nextval('public.matchuproster_matchuprosterid_seq'::regclass);
 L   ALTER TABLE public.matchuproster ALTER COLUMN matchuprosterid DROP DEFAULT;
       public          postgres    false    251    250    251            �           2604    25869 1   matchuprosterplayerstat matchuprosterplayerstatid    DEFAULT     �   ALTER TABLE ONLY public.matchuprosterplayerstat ALTER COLUMN matchuprosterplayerstatid SET DEFAULT nextval('public.matchuprosterplayerstat_matchuprosterplayerstatid_seq'::regclass);
 `   ALTER TABLE public.matchuprosterplayerstat ALTER COLUMN matchuprosterplayerstatid DROP DEFAULT;
       public          postgres    false    253    252    253            �           2604    25727    matchupteam matchupteamid    DEFAULT     �   ALTER TABLE ONLY public.matchupteam ALTER COLUMN matchupteamid SET DEFAULT nextval('public.matchupteam_matchupteamid_seq'::regclass);
 H   ALTER TABLE public.matchupteam ALTER COLUMN matchupteamid DROP DEFAULT;
       public          postgres    false    244    245    245            w           2604    25100    owner ownerid    DEFAULT     n   ALTER TABLE ONLY public.owner ALTER COLUMN ownerid SET DEFAULT nextval('public.owner_ownerid_seq'::regclass);
 <   ALTER TABLE public.owner ALTER COLUMN ownerid DROP DEFAULT;
       public          postgres    false    213    214    214            x           2604    25121    player playerid    DEFAULT     r   ALTER TABLE ONLY public.player ALTER COLUMN playerid SET DEFAULT nextval('public.player_playerid_seq'::regclass);
 >   ALTER TABLE public.player ALTER COLUMN playerid DROP DEFAULT;
       public          postgres    false    215    216    216            {           2604    25385    positiontype positiontypeid    DEFAULT     �   ALTER TABLE ONLY public.positiontype ALTER COLUMN positiontypeid SET DEFAULT nextval('public.positiontype_positiontypeid_seq'::regclass);
 J   ALTER TABLE public.positiontype ALTER COLUMN positiontypeid DROP DEFAULT;
       public          postgres    false    226    225    226            |           2604    25437    rosterposition rosterpositionid    DEFAULT     �   ALTER TABLE ONLY public.rosterposition ALTER COLUMN rosterpositionid SET DEFAULT nextval('public.position_positionid_seq'::regclass);
 N   ALTER TABLE public.rosterposition ALTER COLUMN rosterpositionid DROP DEFAULT;
       public          postgres    false    228    227    228            u           2604    24989    season seasonid    DEFAULT     r   ALTER TABLE ONLY public.season ALTER COLUMN seasonid SET DEFAULT nextval('public.season_seasonid_seq'::regclass);
 >   ALTER TABLE public.season ALTER COLUMN seasonid DROP DEFAULT;
       public          postgres    false    211    212    212            }           2604    25450    seasonposition seasonpositionid    DEFAULT     �   ALTER TABLE ONLY public.seasonposition ALTER COLUMN seasonpositionid SET DEFAULT nextval('public.seasonposition_seasonpositionid_seq'::regclass);
 N   ALTER TABLE public.seasonposition ALTER COLUMN seasonpositionid DROP DEFAULT;
       public          postgres    false    230    229    230                       2604    25494 '   seasonstatcategory seasonstatcategoryid    DEFAULT     �   ALTER TABLE ONLY public.seasonstatcategory ALTER COLUMN seasonstatcategoryid SET DEFAULT nextval('public.seasonstatcategory_seasonstatcategory_seq'::regclass);
 V   ALTER TABLE public.seasonstatcategory ALTER COLUMN seasonstatcategoryid DROP DEFAULT;
       public          postgres    false    233    234    234            ~           2604    25476 /   seasonstatcategorytype seasonstatcategorytypeid    DEFAULT     �   ALTER TABLE ONLY public.seasonstatcategorytype ALTER COLUMN seasonstatcategorytypeid SET DEFAULT nextval('public.seasonstatcategorytype_seasonstatcategorytypeid_seq'::regclass);
 ^   ALTER TABLE public.seasonstatcategorytype ALTER COLUMN seasonstatcategorytypeid DROP DEFAULT;
       public          postgres    false    232    231    232            �           2604    25523 '   seasonstatmodifier seasonstatmodifierid    DEFAULT     �   ALTER TABLE ONLY public.seasonstatmodifier ALTER COLUMN seasonstatmodifierid SET DEFAULT nextval('public.seasonstatmodifier_seasonstatmodifierid_seq'::regclass);
 V   ALTER TABLE public.seasonstatmodifier ALTER COLUMN seasonstatmodifierid DROP DEFAULT;
       public          postgres    false    235    236    236            �           2604    25589    seasonweek seasonweekid    DEFAULT     �   ALTER TABLE ONLY public.seasonweek ALTER COLUMN seasonweekid SET DEFAULT nextval('public.seasonweek_seasonweekid_seq'::regclass);
 F   ALTER TABLE public.seasonweek ALTER COLUMN seasonweekid DROP DEFAULT;
       public          postgres    false    238    239    239            z           2604    25324    transaction transactionid    DEFAULT     �   ALTER TABLE ONLY public.transaction ALTER COLUMN transactionid SET DEFAULT nextval('public.transaction_transactionid_seq'::regclass);
 H   ALTER TABLE public.transaction ALTER COLUMN transactionid DROP DEFAULT;
       public          postgres    false    223    222    223            y           2604    25140 !   transactiontype transactiontypeid    DEFAULT     �   ALTER TABLE ONLY public.transactiontype ALTER COLUMN transactiontypeid SET DEFAULT nextval('public.transactiontype_transactiontypeid_seq'::regclass);
 P   ALTER TABLE public.transactiontype ALTER COLUMN transactiontypeid DROP DEFAULT;
       public          postgres    false    218    219    219            �           2606    25420 !   player GomeCodeTypidYahooPlayerId 
   CONSTRAINT     w   ALTER TABLE ONLY public.player
    ADD CONSTRAINT "GomeCodeTypidYahooPlayerId" UNIQUE (gamecodetypeid, yahooplayerid);
 M   ALTER TABLE ONLY public.player DROP CONSTRAINT "GomeCodeTypidYahooPlayerId";
       public            postgres    false    216    216            �           2606    25424 &   season LeagueIdGameCodeIdYahooLeagueId 
   CONSTRAINT     �   ALTER TABLE ONLY public.season
    ADD CONSTRAINT "LeagueIdGameCodeIdYahooLeagueId" UNIQUE (leagueid, gamecodeid, yahooleagueid);
 R   ALTER TABLE ONLY public.season DROP CONSTRAINT "LeagueIdGameCodeIdYahooLeagueId";
       public            postgres    false    212    212    212            �           2606    25412 #   fantasyteam LeagueIdSeasonIdOwnerId 
   CONSTRAINT     w   ALTER TABLE ONLY public.fantasyteam
    ADD CONSTRAINT "LeagueIdSeasonIdOwnerId" UNIQUE (leagueid, seasonid, ownerid);
 O   ALTER TABLE ONLY public.fantasyteam DROP CONSTRAINT "LeagueIdSeasonIdOwnerId";
       public            postgres    false    210    210    210            �           2606    25426 '   transaction LeagueTeamPlayerTypeYahooId 
   CONSTRAINT     �   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "LeagueTeamPlayerTypeYahooId" UNIQUE (yahootransactionid, transactiontypeid, playerid, fantasyteamid, seasonid);
 S   ALTER TABLE ONLY public.transaction DROP CONSTRAINT "LeagueTeamPlayerTypeYahooId";
       public            postgres    false    223    223    223    223    223            �           2606    25422 !   positiontype PositionGameCodeType 
   CONSTRAINT     {   ALTER TABLE ONLY public.positiontype
    ADD CONSTRAINT "PositionGameCodeType" UNIQUE (yahoopositiontype, gamecodetypeid);
 M   ALTER TABLE ONLY public.positiontype DROP CONSTRAINT "PositionGameCodeType";
       public            postgres    false    226    226            �           2606    25414    gamecode YahooGameCode 
   CONSTRAINT     \   ALTER TABLE ONLY public.gamecode
    ADD CONSTRAINT "YahooGameCode" UNIQUE (yahoogamecode);
 B   ALTER TABLE ONLY public.gamecode DROP CONSTRAINT "YahooGameCode";
       public            postgres    false    206            �           2606    33350    draft draft_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.draft
    ADD CONSTRAINT draft_pkey PRIMARY KEY (draftid);
 :   ALTER TABLE ONLY public.draft DROP CONSTRAINT draft_pkey;
       public            postgres    false    256            �           2606    33380    draft draft_un 
   CONSTRAINT     M   ALTER TABLE ONLY public.draft
    ADD CONSTRAINT draft_un UNIQUE (seasonid);
 8   ALTER TABLE ONLY public.draft DROP CONSTRAINT draft_un;
       public            postgres    false    256            �           2606    33367    draftpick draftpick_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.draftpick
    ADD CONSTRAINT draftpick_pkey PRIMARY KEY (draftpickid);
 B   ALTER TABLE ONLY public.draftpick DROP CONSTRAINT draftpick_pkey;
       public            postgres    false    258            �           2606    33382    draftpick draftpick_un 
   CONSTRAINT     z   ALTER TABLE ONLY public.draftpick
    ADD CONSTRAINT draftpick_un UNIQUE (draftid, round, pick, playerid, fantasyteamid);
 @   ALTER TABLE ONLY public.draftpick DROP CONSTRAINT draftpick_un;
       public            postgres    false    258    258    258    258    258            �           2606    24815    fantasyteam fantasyteam_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.fantasyteam
    ADD CONSTRAINT fantasyteam_pkey PRIMARY KEY (fantasyteamid);
 F   ALTER TABLE ONLY public.fantasyteam DROP CONSTRAINT fantasyteam_pkey;
       public            postgres    false    210            �           2606    16454    gamecode gamecode_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.gamecode
    ADD CONSTRAINT gamecode_pkey PRIMARY KEY (gamecodeid);
 @   ALTER TABLE ONLY public.gamecode DROP CONSTRAINT gamecode_pkey;
       public            postgres    false    206            �           2606    16456 #   gamecode gamecode_yahoogamecode_key 
   CONSTRAINT     g   ALTER TABLE ONLY public.gamecode
    ADD CONSTRAINT gamecode_yahoogamecode_key UNIQUE (yahoogamecode);
 M   ALTER TABLE ONLY public.gamecode DROP CONSTRAINT gamecode_yahoogamecode_key;
       public            postgres    false    206            �           2606    16414    gamecodetype gamecodetype_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.gamecodetype
    ADD CONSTRAINT gamecodetype_pkey PRIMARY KEY (gamecodetypeid);
 H   ALTER TABLE ONLY public.gamecodetype DROP CONSTRAINT gamecodetype_pkey;
       public            postgres    false    204            �           2606    16416 +   gamecodetype gamecodetype_yahoogamecode_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.gamecodetype
    ADD CONSTRAINT gamecodetype_yahoogamecode_key UNIQUE (yahoogamecode);
 U   ALTER TABLE ONLY public.gamecodetype DROP CONSTRAINT gamecodetype_yahoogamecode_key;
       public            postgres    false    204            �           2606    24639    league league_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.league
    ADD CONSTRAINT league_pkey PRIMARY KEY (leagueid);
 <   ALTER TABLE ONLY public.league DROP CONSTRAINT league_pkey;
       public            postgres    false    207            �           2606    25416    league leaguename 
   CONSTRAINT     R   ALTER TABLE ONLY public.league
    ADD CONSTRAINT leaguename UNIQUE (leaguename);
 ;   ALTER TABLE ONLY public.league DROP CONSTRAINT leaguename;
       public            postgres    false    207            �           2606    25616    matchup matchup_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.matchup
    ADD CONSTRAINT matchup_pkey PRIMARY KEY (matchupid);
 >   ALTER TABLE ONLY public.matchup DROP CONSTRAINT matchup_pkey;
       public            postgres    false    241            �           2606    25751    matchup matchup_un 
   CONSTRAINT        ALTER TABLE ONLY public.matchup
    ADD CONSTRAINT matchup_un UNIQUE (seasonid, seasonweekid, fantasyteamid1, fantasyteamid2);
 <   ALTER TABLE ONLY public.matchup DROP CONSTRAINT matchup_un;
       public            postgres    false    241    241    241    241            �           2606    25774 0   matchupcategoryresult matchupcategoryresult_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.matchupcategoryresult
    ADD CONSTRAINT matchupcategoryresult_pkey PRIMARY KEY (matchupcategoryresultid);
 Z   ALTER TABLE ONLY public.matchupcategoryresult DROP CONSTRAINT matchupcategoryresult_pkey;
       public            postgres    false    247            �           2606    25809 .   matchupcategoryresult matchupcategoryresult_un 
   CONSTRAINT     �   ALTER TABLE ONLY public.matchupcategoryresult
    ADD CONSTRAINT matchupcategoryresult_un UNIQUE (matchupid, seasonstatcategoryid);
 X   ALTER TABLE ONLY public.matchupcategoryresult DROP CONSTRAINT matchupcategoryresult_un;
       public            postgres    false    247    247            �           2606    25797 ,   matchupcategoryteam matchupcategoryteam_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public.matchupcategoryteam
    ADD CONSTRAINT matchupcategoryteam_pkey PRIMARY KEY (matchupcategoryteamid);
 V   ALTER TABLE ONLY public.matchupcategoryteam DROP CONSTRAINT matchupcategoryteam_pkey;
       public            postgres    false    249            �           2606    25823 *   matchupcategoryteam matchupcategoryteam_un 
   CONSTRAINT     �   ALTER TABLE ONLY public.matchupcategoryteam
    ADD CONSTRAINT matchupcategoryteam_un UNIQUE (matchupteamid, seasonstatcategoryid);
 T   ALTER TABLE ONLY public.matchupcategoryteam DROP CONSTRAINT matchupcategoryteam_un;
       public            postgres    false    249    249            �           2606    25719 &   matchupgradetype matchupgradetype_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public.matchupgradetype
    ADD CONSTRAINT matchupgradetype_pkey PRIMARY KEY (matchupgradetypeid);
 P   ALTER TABLE ONLY public.matchupgradetype DROP CONSTRAINT matchupgradetype_pkey;
       public            postgres    false    243            �           2606    25749 $   matchupgradetype matchupgradetype_un 
   CONSTRAINT     `   ALTER TABLE ONLY public.matchupgradetype
    ADD CONSTRAINT matchupgradetype_un UNIQUE (grade);
 N   ALTER TABLE ONLY public.matchupgradetype DROP CONSTRAINT matchupgradetype_un;
       public            postgres    false    243            �           2606    25853     matchuproster matchuproster_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.matchuproster
    ADD CONSTRAINT matchuproster_pkey PRIMARY KEY (matchuprosterid);
 J   ALTER TABLE ONLY public.matchuproster DROP CONSTRAINT matchuproster_pkey;
       public            postgres    false    251            �           2606    33315    matchuproster matchuproster_un 
   CONSTRAINT     �   ALTER TABLE ONLY public.matchuproster
    ADD CONSTRAINT matchuproster_un UNIQUE (matchupteamid, playerid, gamedate, seasonpositionid);
 H   ALTER TABLE ONLY public.matchuproster DROP CONSTRAINT matchuproster_un;
       public            postgres    false    251    251    251    251            �           2606    25871 4   matchuprosterplayerstat matchuprosterplayerstat_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.matchuprosterplayerstat
    ADD CONSTRAINT matchuprosterplayerstat_pkey PRIMARY KEY (matchuprosterplayerstatid);
 ^   ALTER TABLE ONLY public.matchuprosterplayerstat DROP CONSTRAINT matchuprosterplayerstat_pkey;
       public            postgres    false    253            �           2606    33340 2   matchuprosterplayerstat matchuprosterplayerstat_un 
   CONSTRAINT     �   ALTER TABLE ONLY public.matchuprosterplayerstat
    ADD CONSTRAINT matchuprosterplayerstat_un UNIQUE (matchuprosterid, seasonstatcategoryid);
 \   ALTER TABLE ONLY public.matchuprosterplayerstat DROP CONSTRAINT matchuprosterplayerstat_un;
       public            postgres    false    253    253            �           2606    25732    matchupteam matchupteam_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.matchupteam
    ADD CONSTRAINT matchupteam_pkey PRIMARY KEY (matchupteamid);
 F   ALTER TABLE ONLY public.matchupteam DROP CONSTRAINT matchupteam_pkey;
       public            postgres    false    245            �           2606    25763    matchupteam matchupteam_un 
   CONSTRAINT     i   ALTER TABLE ONLY public.matchupteam
    ADD CONSTRAINT matchupteam_un UNIQUE (matchupid, fantasyteamid);
 D   ALTER TABLE ONLY public.matchupteam DROP CONSTRAINT matchupteam_un;
       public            postgres    false    245    245            �           2606    25765 &   matchupteam matchupteam_un_tiedmatchup 
   CONSTRAINT     r   ALTER TABLE ONLY public.matchupteam
    ADD CONSTRAINT matchupteam_un_tiedmatchup UNIQUE (matchupid, tiedpoints);
 P   ALTER TABLE ONLY public.matchupteam DROP CONSTRAINT matchupteam_un_tiedmatchup;
       public            postgres    false    245    245            �           2606    25428    transactiontype name 
   CONSTRAINT     ^   ALTER TABLE ONLY public.transactiontype
    ADD CONSTRAINT name UNIQUE (transactiontypename);
 >   ALTER TABLE ONLY public.transactiontype DROP CONSTRAINT name;
       public            postgres    false    219            �           2606    25102    owner owner_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.owner
    ADD CONSTRAINT owner_pkey PRIMARY KEY (ownerid);
 :   ALTER TABLE ONLY public.owner DROP CONSTRAINT owner_pkey;
       public            postgres    false    214            �           2606    25123    player player_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (playerid);
 <   ALTER TABLE ONLY public.player DROP CONSTRAINT player_pkey;
       public            postgres    false    216            �           2606    25439    rosterposition position_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.rosterposition
    ADD CONSTRAINT position_pkey PRIMARY KEY (rosterpositionid);
 F   ALTER TABLE ONLY public.rosterposition DROP CONSTRAINT position_pkey;
       public            postgres    false    228            �           2606    25387    positiontype positiontype_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.positiontype
    ADD CONSTRAINT positiontype_pkey PRIMARY KEY (positiontypeid);
 H   ALTER TABLE ONLY public.positiontype DROP CONSTRAINT positiontype_pkey;
       public            postgres    false    226            �           2606    25540     rosterposition rosterposition_un 
   CONSTRAINT     s   ALTER TABLE ONLY public.rosterposition
    ADD CONSTRAINT rosterposition_un UNIQUE (positionname, gamecodetypeid);
 J   ALTER TABLE ONLY public.rosterposition DROP CONSTRAINT rosterposition_un;
       public            postgres    false    228    228            �           2606    24992    season season_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.season
    ADD CONSTRAINT season_pkey PRIMARY KEY (seasonid);
 <   ALTER TABLE ONLY public.season DROP CONSTRAINT season_pkey;
       public            postgres    false    212            �           2606    25452 "   seasonposition seasonposition_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.seasonposition
    ADD CONSTRAINT seasonposition_pkey PRIMARY KEY (seasonpositionid);
 L   ALTER TABLE ONLY public.seasonposition DROP CONSTRAINT seasonposition_pkey;
       public            postgres    false    230            �           2606    25496 *   seasonstatcategory seasonstatcategory_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.seasonstatcategory
    ADD CONSTRAINT seasonstatcategory_pkey PRIMARY KEY (seasonstatcategoryid);
 T   ALTER TABLE ONLY public.seasonstatcategory DROP CONSTRAINT seasonstatcategory_pkey;
       public            postgres    false    234            �           2606    25560 (   seasonstatcategory seasonstatcategory_un 
   CONSTRAINT     �   ALTER TABLE ONLY public.seasonstatcategory
    ADD CONSTRAINT seasonstatcategory_un UNIQUE (seasonid, seasonstatcategorytypeid);
 R   ALTER TABLE ONLY public.seasonstatcategory DROP CONSTRAINT seasonstatcategory_un;
       public            postgres    false    234    234            �           2606    25478 2   seasonstatcategorytype seasonstatcategorytype_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.seasonstatcategorytype
    ADD CONSTRAINT seasonstatcategorytype_pkey PRIMARY KEY (seasonstatcategorytypeid);
 \   ALTER TABLE ONLY public.seasonstatcategorytype DROP CONSTRAINT seasonstatcategorytype_pkey;
       public            postgres    false    232            �           2606    25569 0   seasonstatcategorytype seasonstatcategorytype_un 
   CONSTRAINT     �   ALTER TABLE ONLY public.seasonstatcategorytype
    ADD CONSTRAINT seasonstatcategorytype_un UNIQUE (yahoocategoryid, gamecodetypeid);
 Z   ALTER TABLE ONLY public.seasonstatcategorytype DROP CONSTRAINT seasonstatcategorytype_un;
       public            postgres    false    232    232            �           2606    25528 *   seasonstatmodifier seasonstatmodifier_pkey 
   CONSTRAINT     z   ALTER TABLE ONLY public.seasonstatmodifier
    ADD CONSTRAINT seasonstatmodifier_pkey PRIMARY KEY (seasonstatmodifierid);
 T   ALTER TABLE ONLY public.seasonstatmodifier DROP CONSTRAINT seasonstatmodifier_pkey;
       public            postgres    false    236            �           2606    25648 (   seasonstatmodifier seasonstatmodifier_un 
   CONSTRAINT     s   ALTER TABLE ONLY public.seasonstatmodifier
    ADD CONSTRAINT seasonstatmodifier_un UNIQUE (seasonstatcategoryid);
 R   ALTER TABLE ONLY public.seasonstatmodifier DROP CONSTRAINT seasonstatmodifier_un;
       public            postgres    false    236            �           2606    25592    seasonweek seasonweek_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.seasonweek
    ADD CONSTRAINT seasonweek_pkey PRIMARY KEY (seasonweekid);
 D   ALTER TABLE ONLY public.seasonweek DROP CONSTRAINT seasonweek_pkey;
       public            postgres    false    239            �           2606    25660    seasonweek seasonweek_un 
   CONSTRAINT     c   ALTER TABLE ONLY public.seasonweek
    ADD CONSTRAINT seasonweek_un UNIQUE (seasonid, weeknumber);
 B   ALTER TABLE ONLY public.seasonweek DROP CONSTRAINT seasonweek_un;
       public            postgres    false    239    239            �           2606    25326    transaction transaction_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (transactionid);
 F   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_pkey;
       public            postgres    false    223            �           2606    25142 $   transactiontype transactiontype_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.transactiontype
    ADD CONSTRAINT transactiontype_pkey PRIMARY KEY (transactiontypeid);
 N   ALTER TABLE ONLY public.transactiontype DROP CONSTRAINT transactiontype_pkey;
       public            postgres    false    219            �           2606    25418    owner yahooguid 
   CONSTRAINT     O   ALTER TABLE ONLY public.owner
    ADD CONSTRAINT yahooguid UNIQUE (yahooguid);
 9   ALTER TABLE ONLY public.owner DROP CONSTRAINT yahooguid;
       public            postgres    false    214            �           1259    33323    i_nulltest2    INDEX     �   CREATE UNIQUE INDEX i_nulltest2 ON public.matchuproster USING btree (matchupteamid, playerid, seasonpositionid, ((gamedate IS NULL))) WHERE (gamedate IS NULL);
    DROP INDEX public.i_nulltest2;
       public            postgres    false    251    251    251    251    251            (           2606    33351    draft draft_seasonid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.draft
    ADD CONSTRAINT draft_seasonid_fkey FOREIGN KEY (seasonid) REFERENCES public.season(seasonid);
 C   ALTER TABLE ONLY public.draft DROP CONSTRAINT draft_seasonid_fkey;
       public          postgres    false    256    212    3242            )           2606    33368     draftpick draftpick_draftid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.draftpick
    ADD CONSTRAINT draftpick_draftid_fkey FOREIGN KEY (draftid) REFERENCES public.draft(draftid);
 J   ALTER TABLE ONLY public.draftpick DROP CONSTRAINT draftpick_draftid_fkey;
       public          postgres    false    258    3317    256            *           2606    33374 &   draftpick draftpick_fantasyteamid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.draftpick
    ADD CONSTRAINT draftpick_fantasyteamid_fkey FOREIGN KEY (fantasyteamid) REFERENCES public.fantasyteam(fantasyteamid);
 P   ALTER TABLE ONLY public.draftpick DROP CONSTRAINT draftpick_fantasyteamid_fkey;
       public          postgres    false    258    210    3238                        2606    33386 '   fantasyteam fantasyteam_draftgrade_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.fantasyteam
    ADD CONSTRAINT fantasyteam_draftgrade_fkey FOREIGN KEY (gradeid) REFERENCES public.matchupgradetype(matchupgradetypeid);
 Q   ALTER TABLE ONLY public.fantasyteam DROP CONSTRAINT fantasyteam_draftgrade_fkey;
       public          postgres    false    210    3290    243            �           2606    24597    league fk_gamecodetypeid    FK CONSTRAINT     �   ALTER TABLE ONLY public.league
    ADD CONSTRAINT fk_gamecodetypeid FOREIGN KEY (gamecodetypeid) REFERENCES public.gamecodetype(gamecodetypeid);
 B   ALTER TABLE ONLY public.league DROP CONSTRAINT fk_gamecodetypeid;
       public          postgres    false    204    3222    207            �           2606    24816    fantasyteam fk_leagueid    FK CONSTRAINT     ~   ALTER TABLE ONLY public.fantasyteam
    ADD CONSTRAINT fk_leagueid FOREIGN KEY (leagueid) REFERENCES public.league(leagueid);
 A   ALTER TABLE ONLY public.fantasyteam DROP CONSTRAINT fk_leagueid;
       public          postgres    false    3232    210    207            �           2606    25003    fantasyteam fk_sesaon    FK CONSTRAINT     |   ALTER TABLE ONLY public.fantasyteam
    ADD CONSTRAINT fk_sesaon FOREIGN KEY (seasonid) REFERENCES public.season(seasonid);
 ?   ALTER TABLE ONLY public.fantasyteam DROP CONSTRAINT fk_sesaon;
       public          postgres    false    210    3242    212            �           2606    16457 %   gamecode gamecode_gamecodetypeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.gamecode
    ADD CONSTRAINT gamecode_gamecodetypeid_fkey FOREIGN KEY (gamecodetypeid) REFERENCES public.gamecodetype(gamecodetypeid);
 O   ALTER TABLE ONLY public.gamecode DROP CONSTRAINT gamecode_gamecodetypeid_fkey;
       public          postgres    false    204    206    3222                       2606    25622 !   matchup matchup_fantasyteam1_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchup
    ADD CONSTRAINT matchup_fantasyteam1_fkey FOREIGN KEY (fantasyteamid1) REFERENCES public.fantasyteam(fantasyteamid);
 K   ALTER TABLE ONLY public.matchup DROP CONSTRAINT matchup_fantasyteam1_fkey;
       public          postgres    false    210    241    3238                       2606    25627 !   matchup matchup_fantasyteam2_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchup
    ADD CONSTRAINT matchup_fantasyteam2_fkey FOREIGN KEY (fantasyteamid2) REFERENCES public.fantasyteam(fantasyteamid);
 K   ALTER TABLE ONLY public.matchup DROP CONSTRAINT matchup_fantasyteam2_fkey;
       public          postgres    false    241    210    3238                       2606    25757    matchup matchup_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchup
    ADD CONSTRAINT matchup_fk FOREIGN KEY (seasonweekid) REFERENCES public.seasonweek(seasonweekid);
 <   ALTER TABLE ONLY public.matchup DROP CONSTRAINT matchup_fk;
       public          postgres    false    241    3282    239                       2606    25649 !   matchup matchup_losingteamid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchup
    ADD CONSTRAINT matchup_losingteamid_fkey FOREIGN KEY (losingteamid) REFERENCES public.fantasyteam(fantasyteamid);
 K   ALTER TABLE ONLY public.matchup DROP CONSTRAINT matchup_losingteamid_fkey;
       public          postgres    false    241    3238    210                       2606    25637    matchup matchup_seasonid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchup
    ADD CONSTRAINT matchup_seasonid_fkey FOREIGN KEY (seasonid) REFERENCES public.season(seasonid);
 G   ALTER TABLE ONLY public.matchup DROP CONSTRAINT matchup_seasonid_fkey;
       public          postgres    false    3242    241    212                       2606    25632 "   matchup matchup_winningteamid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchup
    ADD CONSTRAINT matchup_winningteamid_fkey FOREIGN KEY (winningteamid) REFERENCES public.fantasyteam(fantasyteamid);
 L   ALTER TABLE ONLY public.matchup DROP CONSTRAINT matchup_winningteamid_fkey;
       public          postgres    false    241    3238    210                        2606    25841 5   matchupcategoryresult matchupcategory_losingteamid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchupcategoryresult
    ADD CONSTRAINT matchupcategory_losingteamid_fk FOREIGN KEY (losingteamid) REFERENCES public.matchupteam(matchupteamid);
 _   ALTER TABLE ONLY public.matchupcategoryresult DROP CONSTRAINT matchupcategory_losingteamid_fk;
       public          postgres    false    3294    247    245                       2606    25836 6   matchupcategoryresult matchupcategory_winningteamid_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchupcategoryresult
    ADD CONSTRAINT matchupcategory_winningteamid_fk FOREIGN KEY (winningteamid) REFERENCES public.matchupteam(matchupteamid);
 `   ALTER TABLE ONLY public.matchupcategoryresult DROP CONSTRAINT matchupcategory_winningteamid_fk;
       public          postgres    false    3294    245    247                       2606    25775 E   matchupcategoryresult matchupcategoryresult_seasonstatcategoryid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchupcategoryresult
    ADD CONSTRAINT matchupcategoryresult_seasonstatcategoryid_fkey FOREIGN KEY (seasonstatcategoryid) REFERENCES public.seasonstatcategory(seasonstatcategoryid);
 o   ALTER TABLE ONLY public.matchupcategoryresult DROP CONSTRAINT matchupcategoryresult_seasonstatcategoryid_fkey;
       public          postgres    false    3274    234    247            !           2606    25812 :   matchupcategoryteam matchupcategoryteam_matchupteamid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchupcategoryteam
    ADD CONSTRAINT matchupcategoryteam_matchupteamid_fkey FOREIGN KEY (matchupteamid) REFERENCES public.matchupteam(matchupteamid);
 d   ALTER TABLE ONLY public.matchupcategoryteam DROP CONSTRAINT matchupcategoryteam_matchupteamid_fkey;
       public          postgres    false    3294    249    245            "           2606    25817 A   matchupcategoryteam matchupcategoryteam_seasonstatcategoryid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchupcategoryteam
    ADD CONSTRAINT matchupcategoryteam_seasonstatcategoryid_fkey FOREIGN KEY (seasonstatcategoryid) REFERENCES public.seasonstatcategory(seasonstatcategoryid);
 k   ALTER TABLE ONLY public.matchupcategoryteam DROP CONSTRAINT matchupcategoryteam_seasonstatcategoryid_fkey;
       public          postgres    false    3274    234    249            #           2606    25854 .   matchuproster matchuproster_matchupteamid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchuproster
    ADD CONSTRAINT matchuproster_matchupteamid_fkey FOREIGN KEY (matchupteamid) REFERENCES public.matchupteam(matchupteamid);
 X   ALTER TABLE ONLY public.matchuproster DROP CONSTRAINT matchuproster_matchupteamid_fkey;
       public          postgres    false    3294    245    251            $           2606    25859 )   matchuproster matchuproster_playerid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchuproster
    ADD CONSTRAINT matchuproster_playerid_fkey FOREIGN KEY (playerid) REFERENCES public.player(playerid);
 S   ALTER TABLE ONLY public.matchuproster DROP CONSTRAINT matchuproster_playerid_fkey;
       public          postgres    false    3250    251    216            %           2606    25882 1   matchuproster matchuproster_seasonpositionid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchuproster
    ADD CONSTRAINT matchuproster_seasonpositionid_fkey FOREIGN KEY (seasonpositionid) REFERENCES public.seasonposition(seasonpositionid);
 [   ALTER TABLE ONLY public.matchuproster DROP CONSTRAINT matchuproster_seasonpositionid_fkey;
       public          postgres    false    3268    230    251            &           2606    25872 D   matchuprosterplayerstat matchuprosterplayerstat_matchuprosterid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchuprosterplayerstat
    ADD CONSTRAINT matchuprosterplayerstat_matchuprosterid_fkey FOREIGN KEY (matchuprosterid) REFERENCES public.matchuproster(matchuprosterid);
 n   ALTER TABLE ONLY public.matchuprosterplayerstat DROP CONSTRAINT matchuprosterplayerstat_matchuprosterid_fkey;
       public          postgres    false    3309    251    253            '           2606    25877 I   matchuprosterplayerstat matchuprosterplayerstat_seasonstatcategoryid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchuprosterplayerstat
    ADD CONSTRAINT matchuprosterplayerstat_seasonstatcategoryid_fkey FOREIGN KEY (seasonstatcategoryid) REFERENCES public.seasonstatcategory(seasonstatcategoryid);
 s   ALTER TABLE ONLY public.matchuprosterplayerstat DROP CONSTRAINT matchuprosterplayerstat_seasonstatcategoryid_fkey;
       public          postgres    false    3274    253    234                       2606    25738 *   matchupteam matchupteam_fantasyteamid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchupteam
    ADD CONSTRAINT matchupteam_fantasyteamid_fkey FOREIGN KEY (fantasyteamid) REFERENCES public.fantasyteam(fantasyteamid);
 T   ALTER TABLE ONLY public.matchupteam DROP CONSTRAINT matchupteam_fantasyteamid_fkey;
       public          postgres    false    3238    245    210                       2606    25743 -   matchupteam matchupteam_matchupgradetype_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchupteam
    ADD CONSTRAINT matchupteam_matchupgradetype_fkey FOREIGN KEY (matchupgradetypeid) REFERENCES public.matchupgradetype(matchupgradetypeid);
 W   ALTER TABLE ONLY public.matchupteam DROP CONSTRAINT matchupteam_matchupgradetype_fkey;
       public          postgres    false    245    3290    243                       2606    25733 &   matchupteam matchupteam_matchupid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.matchupteam
    ADD CONSTRAINT matchupteam_matchupid_fkey FOREIGN KEY (matchupid) REFERENCES public.matchup(matchupid);
 P   ALTER TABLE ONLY public.matchupteam DROP CONSTRAINT matchupteam_matchupid_fkey;
       public          postgres    false    241    245    3286                       2606    25103    owner owner_leagueid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.owner
    ADD CONSTRAINT owner_leagueid_fkey FOREIGN KEY (leagueid) REFERENCES public.league(leagueid);
 C   ALTER TABLE ONLY public.owner DROP CONSTRAINT owner_leagueid_fkey;
       public          postgres    false    207    214    3232                       2606    25124 !   player player_gamecodetypeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_gamecodetypeid_fkey FOREIGN KEY (gamecodetypeid) REFERENCES public.gamecodetype(gamecodetypeid);
 K   ALTER TABLE ONLY public.player DROP CONSTRAINT player_gamecodetypeid_fkey;
       public          postgres    false    216    204    3222                       2606    25405 !   player player_positiontypeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_positiontypeid_fkey FOREIGN KEY (positiontypeid) REFERENCES public.positiontype(positiontypeid);
 K   ALTER TABLE ONLY public.player DROP CONSTRAINT player_positiontypeid_fkey;
       public          postgres    false    226    3262    216                       2606    25440 +   rosterposition position_gamecodetypeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.rosterposition
    ADD CONSTRAINT position_gamecodetypeid_fkey FOREIGN KEY (gamecodetypeid) REFERENCES public.gamecodetype(gamecodetypeid);
 U   ALTER TABLE ONLY public.rosterposition DROP CONSTRAINT position_gamecodetypeid_fkey;
       public          postgres    false    3222    204    228                       2606    25393 -   positiontype positiontype_gamecodetypeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.positiontype
    ADD CONSTRAINT positiontype_gamecodetypeid_fkey FOREIGN KEY (gamecodetypeid) REFERENCES public.gamecodetype(gamecodetypeid);
 W   ALTER TABLE ONLY public.positiontype DROP CONSTRAINT positiontype_gamecodetypeid_fkey;
       public          postgres    false    204    3222    226                       2606    24998    season season_gamecodeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.season
    ADD CONSTRAINT season_gamecodeid_fkey FOREIGN KEY (gamecodeid) REFERENCES public.gamecode(gamecodeid);
 G   ALTER TABLE ONLY public.season DROP CONSTRAINT season_gamecodeid_fkey;
       public          postgres    false    206    212    3228                       2606    24993    season season_leagueid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.season
    ADD CONSTRAINT season_leagueid_fkey FOREIGN KEY (leagueid) REFERENCES public.league(leagueid);
 E   ALTER TABLE ONLY public.season DROP CONSTRAINT season_leagueid_fkey;
       public          postgres    false    3232    212    207                       2606    25534 3   seasonposition seasonposition_rosterpositionid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.seasonposition
    ADD CONSTRAINT seasonposition_rosterpositionid_fkey FOREIGN KEY (rosterpositionid) REFERENCES public.rosterposition(rosterpositionid);
 ]   ALTER TABLE ONLY public.seasonposition DROP CONSTRAINT seasonposition_rosterpositionid_fkey;
       public          postgres    false    3264    228    230                       2606    25453 +   seasonposition seasonposition_seasonid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.seasonposition
    ADD CONSTRAINT seasonposition_seasonid_fkey FOREIGN KEY (seasonid) REFERENCES public.season(seasonid);
 U   ALTER TABLE ONLY public.seasonposition DROP CONSTRAINT seasonposition_seasonid_fkey;
       public          postgres    false    3242    230    212                       2606    25502 3   seasonstatcategory seasonstatcategory_seasonid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.seasonstatcategory
    ADD CONSTRAINT seasonstatcategory_seasonid_fkey FOREIGN KEY (seasonid) REFERENCES public.season(seasonid);
 ]   ALTER TABLE ONLY public.seasonstatcategory DROP CONSTRAINT seasonstatcategory_seasonid_fkey;
       public          postgres    false    234    3242    212                       2606    25497 C   seasonstatcategory seasonstatcategory_seasonstatcategorytypeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.seasonstatcategory
    ADD CONSTRAINT seasonstatcategory_seasonstatcategorytypeid_fkey FOREIGN KEY (seasonstatcategorytypeid) REFERENCES public.seasonstatcategorytype(seasonstatcategorytypeid);
 m   ALTER TABLE ONLY public.seasonstatcategory DROP CONSTRAINT seasonstatcategory_seasonstatcategorytypeid_fkey;
       public          postgres    false    3270    232    234                       2606    25484 A   seasonstatcategorytype seasonstatcategorytype_gamecodetypeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.seasonstatcategorytype
    ADD CONSTRAINT seasonstatcategorytype_gamecodetypeid_fkey FOREIGN KEY (gamecodetypeid) REFERENCES public.gamecodetype(gamecodetypeid);
 k   ALTER TABLE ONLY public.seasonstatcategorytype DROP CONSTRAINT seasonstatcategorytype_gamecodetypeid_fkey;
       public          postgres    false    232    204    3222                       2606    25563 A   seasonstatcategorytype seasonstatcategorytype_positiontypeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.seasonstatcategorytype
    ADD CONSTRAINT seasonstatcategorytype_positiontypeid_fkey FOREIGN KEY (positiontypeid) REFERENCES public.positiontype(positiontypeid);
 k   ALTER TABLE ONLY public.seasonstatcategorytype DROP CONSTRAINT seasonstatcategorytype_positiontypeid_fkey;
       public          postgres    false    226    3262    232                       2606    25529 ?   seasonstatmodifier seasonstatmodifier_seasonstatcategoryid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.seasonstatmodifier
    ADD CONSTRAINT seasonstatmodifier_seasonstatcategoryid_fkey FOREIGN KEY (seasonstatcategoryid) REFERENCES public.seasonstatcategory(seasonstatcategoryid);
 i   ALTER TABLE ONLY public.seasonstatmodifier DROP CONSTRAINT seasonstatmodifier_seasonstatcategoryid_fkey;
       public          postgres    false    236    3274    234                       2606    25593 #   seasonweek seasonweek_seasonid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.seasonweek
    ADD CONSTRAINT seasonweek_seasonid_fkey FOREIGN KEY (seasonid) REFERENCES public.season(seasonid);
 M   ALTER TABLE ONLY public.seasonweek DROP CONSTRAINT seasonweek_seasonid_fkey;
       public          postgres    false    212    3242    239                       2606    25332 *   transaction transaction_fantasyteamid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_fantasyteamid_fkey FOREIGN KEY (fantasyteamid) REFERENCES public.fantasyteam(fantasyteamid);
 T   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_fantasyteamid_fkey;
       public          postgres    false    210    223    3238            	           2606    25342 %   transaction transaction_playerid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_playerid_fkey FOREIGN KEY (playerid) REFERENCES public.player(playerid);
 O   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_playerid_fkey;
       public          postgres    false    216    223    3250                       2606    25327 %   transaction transaction_seasonid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_seasonid_fkey FOREIGN KEY (seasonid) REFERENCES public.season(seasonid);
 O   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_seasonid_fkey;
       public          postgres    false    3242    212    223                       2606    25337 ,   transaction transaction_tradefromteamid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_tradefromteamid_fkey FOREIGN KEY (tradefromteamid) REFERENCES public.fantasyteam(fantasyteamid);
 V   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_tradefromteamid_fkey;
       public          postgres    false    3238    223    210            
           2606    25347 .   transaction transaction_transactiontypeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_transactiontypeid_fkey FOREIGN KEY (transactiontypeid) REFERENCES public.transactiontype(transactiontypeid);
 X   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_transactiontypeid_fkey;
       public          postgres    false    223    219    3254           
<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
    CodeBehind="Default.aspx.cs" Inherits="BannoCodeAssignment._Default" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    
    <a href="#" onclick="getFavorites()">Favorites</a>
    <br />

    <form action="#">
        <input type="text" id="tbSearch" />
        <input type="submit" value="Search Youtube" />
        <br />
        <div id="searchResults"></div>
        <div id="favoritesList"></div>
    </form>

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
    <script type="text/javascript" src="Scripts/app.js"></script>
    <script type="text/javascript" src="https://apis.google.com/js/client.js?onload=init"></script>
    <script type="text/javascript" src="https://apis.google.com/js/auth.js?onload=authorize"></script>

</asp:Content>

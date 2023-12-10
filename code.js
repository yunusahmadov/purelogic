// Purelogic Cutter
var umName = 0;
var umCoef = 1.0;
var umCoef2 = 0.423;
var umCoef3 = 3600;
var umDecimals = 3;
var umDecimals2 = 2;
var umDecimals4 = 4;
var bRapidG;
var nSheet = 0, szMater = "", szGauge = "";
var szJob = "", szDraw = "", szTakeoff = "";
var curX = 0; 
var curY = 0; //vars for current position of torch
var curZ = 0; 
var bTorch = 0;  
var bArc = 0;
var ZStart = 10;         
var string_number =10;
var plus_number=10;
var FWork = 15000;      
var FStart = true;
var hbDefault=3;   //HeightBurn default value
var hwDefault=1.5; //HeightWork default value


function OnInit(szJb,szTak)
{
Format(string_number);
string_number += plus_number;

Today = new Date();
Day = Today.getDate();
Month = Today.getMonth() + 1;
Year = Today.getFullYear();
CurrentDate = Day + "." + Month + "." + Year;

//Format(string_number);
//string_number += 5;

sendfin_boj("(Post processor: Pumotix THC.scpost)",1);
Format(string_number);
string_number += plus_number;
sendfin_boj(("Date: "+CurrentDate) ,2);
Format(string_number);
string_number += plus_number;
sendfin_boj("G21 (Units: Metric)" ,3);
Format(string_number);
string_number += plus_number;
sendfin_boj("G90 G91.1 G40",4);
Format(string_number);
string_number += plus_number;
sendfin_boj("F1",5);
Format(string_number);
string_number += plus_number;
sendfin_boj("M101",6);

//1 Attempt, get tha value of Z from Sheets table  isn't work on "onInit function"
/*var z2 = in2um(get_value("HeightMove"), umCoef, umDecimals);
if(z2 == 0) z1 = ZStart;
Format(string_number);
string_number +=plus_number;
sendfin_boj("G00 Z"+um2str(z2, umDecimals),7);*/

Format(string_number);
string_number +=plus_number;
sendfin_boj("G00 Z"+um2str(ZStart, umDecimals4),7);
Format(string_number);
string_number +=plus_number;
}

function OnLine(fX, fY,fZ)
{
    curX = curX + fX;
    curY = curY + fY;
    if (is_umzero(fX, umDecimals) && is_umzero(fY, umDecimals)) return;

bArc = 0; 

  if(bTorch == 0)                                                                         
{
//---------------------------------------------------------------------------
send("G00");
      send(" X");
      send(um2str(curX, umDecimals2)); 
      send(" Y");
      sendfin(um2str(curY, umDecimals2)); 
 }    

  if(bTorch)   
 {
Format(string_number);
string_number += plus_number;
send("G01");
      send(" X");
      send(um2str(curX, umDecimals2)); 
      send(" Y");
      sendfin(um2str(curY, umDecimals2)); 

/*if(FStart == true)
{
var f3 = get_value("CutSpeed")/umCoef3;
if(f3 == 0) f3 = FWork;
sendfin("CcCCZXCCZCZXCF" + um2str(f3, umDecimals2));
FStart = false;
}*/
    }
}


//TurnOn
function OnTorchOn() 
    {

Format(string_number);
string_number += plus_number;

/*var f3 = get_value("CutSpeed")/umCoef3;
if(f3 == 0) f3 = FWork;
send(" F" + um2str(f3, umDecimals2));*/
sendfin("M100")

//-------------Height Burn------------------

 var hb = get_value("HeightBurn");
if(hb == 0) hb = hbDefault;
Format(string_number);
string_number += plus_number;
sendfin("G00 Z"+um2str(hb, umDecimals));
Format(string_number);
string_number += plus_number;

//-----------Turn on----------
sendfin("M03");
    bTorch = 1;
FStart =true;
Format(string_number);
string_number += plus_number;
sendfin("G04 P0.5");
FStart =true;
Format(string_number);


//-------------Height Work------------------

 var hw = get_value("HeightWork");
if(hw == 0) hb = hwDefault;
send("G00 Z"+um2str(hw, umDecimals));
var tSpeed=get_value("TravelSpeed")/umCoef3;
sendfin(" F"+tSpeed);
    }

//Turn Off
function OnTorchOff() 
    {
Format(string_number);
string_number += plus_number;
    sendfin("M05");
    bTorch = 0;
    var z1 = in2um(get_value("HeightMove"), umCoef, umDecimals);
if(z1 == 0) z1 = ZStart;
Format(string_number);
string_number +=plus_number;
sendfin("G0 Z"+um2str(z1, umDecimals));
Format(string_number);
string_number +=plus_number;
}

function OnArc(fEndX, fEndY, fCenterX, fCenterY, fRadius, bCW)
    {
    curX = curX + fEndX;                        
    curY = curY + fEndY;

   if (is_umzero(curX, umDecimals) && is_umzero(curY, umDecimals)) return;
   if (is_umzero(fCenterX, umDecimals) && is_umzero(fCenterY,umDecimals)) return;

    if(bCW == true) { 
Format(string_number);
string_number += plus_number;

/*if(FStart == true)
{
var f3 = get_value("CutSpeed")/umCoef3;
if(f3 == 0) f3 = FWork;
send(" F" + um2str(f3, umDecimals2));
FStart = false;
}*/

send("G2"); }
    else { 
Format(string_number);
string_number += plus_number;



send("G3"); }
    bArc = 1;                                   

    send(" X");
    send(um2str(curX, umDecimals2));
    send(" Y");
    send(um2str(curY, umDecimals2));
    send(" I");
    send(um2str(fCenterX, umDecimals2));
    send(" J");
    sendfin(um2str(fCenterY, umDecimals2));
    }

function OnDone()		
    {
Format(string_number);
string_number += plus_number;
sendfin_eoj("M30", 1);
    }

function Format(string_number)
{
send("N00" + string_number + " ");
}
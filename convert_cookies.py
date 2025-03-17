import json

# Your browser cookies
browser_cookies = [
    {"domain":".yingjiesheng.com","expirationDate":1772760264.497254,"hostOnly":False,"httpOnly":False,"name":"CookieUuid","path":"/","sameSite":"unspecified","secure":False,"session":False,"storeId":"0","value":"8f10304c302ab8629acc6a8b1b9222e0"},
    {"domain":"q.yingjiesheng.com","expirationDate":1772761533.283455,"hostOnly":True,"httpOnly":False,"name":"uid","path":"/","sameSite":"unspecified","secure":False,"session":False,"storeId":"0","value":"wKhK7mea2b0NoUtPLem7Ag=="},
    {"domain":".yingjiesheng.com","expirationDate":1744769279,"hostOnly":False,"httpOnly":False,"name":"Yjs_logindata","path":"/","sameSite":"unspecified","secure":False,"session":False,"storeId":"0","value":"{%22is51jobUserMobile%22:%221%22%2C%22isShowBind51job%22:false%2C%22isNewYJS%22:%220%22}"},
    {"domain":".yingjiesheng.com","expirationDate":1744769281.137759,"hostOnly":False,"httpOnly":False,"name":"Yjs_Partner","path":"/","sameSite":"lax","secure":False,"session":False,"storeId":"0","value":""},
    {"domain":".yingjiesheng.com","expirationDate":1771630895,"hostOnly":False,"httpOnly":False,"name":"Hm_lvt_b15730ce74e116ff0df97e207706fa4a","path":"/","sameSite":"unspecified","secure":False,"session":False,"storeId":"0","value":"1740094886"},
    {"domain":".yingjiesheng.com","expirationDate":1771630896,"hostOnly":False,"httpOnly":False,"name":"Hm_lvt_a5e61e07eeae649be5a862f42c636bc7","path":"/","sameSite":"unspecified","secure":False,"session":False,"storeId":"0","value":"1740094889"},
    {"domain":".q.yingjiesheng.com","expirationDate":1773764978,"hostOnly":False,"httpOnly":False,"name":"Hm_lvt_6465b7e5e0e872fc416968a53d4fb422","path":"/","sameSite":"unspecified","secure":False,"session":False,"storeId":"0","value":"1741532974"},
    {"domain":".q.yingjiesheng.com","hostOnly":False,"httpOnly":False,"name":"HMACCOUNT","path":"/","sameSite":"unspecified","secure":False,"session":True,"storeId":"0","value":"ABE831302B97B64A"},
    {"domain":".yingjiesheng.com","expirationDate":1776788977.242231,"hostOnly":False,"httpOnly":False,"name":"sensorsdata2015jssdkcross","path":"/","sameSite":"unspecified","secure":False,"session":False,"storeId":"0","value":"%7B%22distinct_id%22%3A%22198242887%22%2C%22first_id%22%3A%228f10304c302ab8629acc6a8b1b9222e0%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24latest_landing_page%22%3A%22https%3A%2F%2Fwww.yingjiesheng.com%2F%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfbG9naW5faWQiOiIxOTgyNDI4ODciLCIkaWRlbnRpdHlfY29va2llX2lkIjoiMTk0YjRjZjJmMzcyNDFiLTBiMjI4ZTAyZjMyNWI3LTFlNTI1NjM2LTE0MDUzMjAtMTk0YjRjZjJmMzgyODUyIiwiJGlkZW50aXR5X2Fub255bW91c19pZCI6IjhmMTAzMDRjMzAyYWI4NjI5YWNjNmE4YjFiOTIyMmUwIn0%3D%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22198242887%22%7D%2C%22%24device_id%22%3A%22194b4cf2f37241b-0b228e02f325b7-1e525636-1405320-194b4cf2f382852%22%7D"},
    {"domain":".yingjiesheng.com","expirationDate":1744769281.138473,"hostOnly":False,"httpOnly":False,"name":"Yjs_UAccountId","path":"/","sameSite":"lax","secure":False,"session":False,"storeId":"0","value":"198242887"},
    {"domain":".yingjiesheng.com","expirationDate":1744769281.138332,"hostOnly":False,"httpOnly":True,"name":"Yjs_UToken","path":"/","sameSite":"lax","secure":False,"session":False,"storeId":"0","value":"1d062ae533ee24e7fabd4a11b37e7037"},
    {"domain":".yingjiesheng.com","expirationDate":1744820472.764131,"hostOnly":False,"httpOnly":False,"name":"Yjs_Udate","path":"/","sameSite":"lax","secure":False,"session":False,"storeId":"0","value":"2021%2F10%2F10"},
    {"domain":".yingjiesheng.com","hostOnly":False,"httpOnly":False,"name":"YSSN","path":"/","sameSite":"unspecified","secure":False,"session":True,"storeId":"0","value":"8inn5t1spc93g0bs3m9lhj6eqgt0dl4m"},
    {"domain":".q.yingjiesheng.com","hostOnly":False,"httpOnly":False,"name":"Hm_lpvt_6465b7e5e0e872fc416968a53d4fb422","path":"/","sameSite":"unspecified","secure":False,"session":True,"storeId":"0","value":"1742228978"},
    {"domain":".yingjiesheng.com","expirationDate":1757729309,"hostOnly":False,"httpOnly":False,"name":"ssxmod_itna","path":"/","sameSite":"unspecified","secure":False,"session":False,"storeId":"0","value":"Yq0xnD2DyGDQG=oGHqGd6SiUQwp47IKGCKDs939DBqxAKoDZDiqAPGhDC+RAhfOGLKUC6bYA=KWn7cYHN8EmoxiYFx+03sYmDAoDhx7QDox0=DnxAQDjohGeDxpq0rD74irDDxD30xDvsLpKDjmvC9EHHE19HLp5DbpFODiF8DYypDAwhD37z1xbhDWaODQvsEPKDExGOfI9mgxGaHFffDlFODmR3u1M6DCIvIPFPlZHGEELe+CpN/AbrYWPxwnuoKjxrNWG5t2CeKQ+YeB4bChD3CxRDDDpqCEx44D="},
    {"domain":".yingjiesheng.com","expirationDate":1757729309,"hostOnly":False,"httpOnly":False,"name":"ssxmod_itna2","path":"/","sameSite":"unspecified","secure":False,"session":False,"storeId":"0","value":"Yq0xnD2DyGDQG=oGHqGd6SiUQwp47IKGCKDs93D8TP2imAxGXbiGaKQ6xf2nigxxOD8gI2OqrGuKYqeafeeYO=jPcgDko6pBhj53n43jWOUKEaxgEIiNCntIM/SK1gx2yFUS00Mit0YKGuq260xepciOhDYqlWzKgniNCqpQ=c+2AP4YeHTRY++t7AGKYniMBDT=lOhK70YNOimqQY45GD7RADC9AiawE0tzan0V9ha=nYrKnDx86qn9/vQbuy09=RY3iWTqb049lieNx4nP6gsX0dU8=DgBG0DilYpNQUxBw5bQeFs3xzqMd=bdSwoe75ZbY/Y8eYdz0z2o7421df3nbKodaLoWUgN7So+rz1krfhi9oYthNyArTgsoqWf+ThYmoEajjpwYYf8FArxeYQB3CRYCF4A4a=M7kRRrATC=8k=4xex81+o9kzFx8G3oi2tu2LF2tW6NF2YjgjheexlKZ0QK33N8iqRrWhTQObq3agpYrRINcI=g1OEQqhFEhQt2rC43ZDY0Tm2dxyp6Z63PDhyaCvSUBqFIOoG7tQ3minnFomlEUTRbgAXPrda3mM=z9=O93dVODqLbhaoaOxO=ts3TBholDo8ZbwFmHeLFM19xdBM=xk2lgxxMrvuGBMtM6waoBp0QhodOQiwwdhcbL8zY2r3rAwE8zZK3A0RRjKSxMvz8x8BQere7i32DI3FRo0Pthd7qxuRBrEI127xuWe5PITlTf9eto5vOoPfDDQFNQ8tDa63wGM74arof3rBaE+TwY0zD08DG7=GDD==="}
]

# Convert to Playwright format
playwright_cookies = []
for cookie in browser_cookies:
    # Standard conversion of browser cookie format to Playwright format
    playwright_cookie = {
        "name": cookie["name"],
        "value": cookie["value"],
        "domain": cookie["domain"],
        "path": cookie["path"],
    }
    
    # Handle expiration
    if "expirationDate" in cookie and not cookie["session"]:
        playwright_cookie["expires"] = cookie["expirationDate"]
    
    # Handle sameSite property - fix 'unspecified' to valid value
    if "sameSite" in cookie:
        sameSite = cookie["sameSite"]
        if sameSite == "unspecified" or sameSite == "":
            playwright_cookie["sameSite"] = "None"
        else:
            # Convert first letter to uppercase for Playwright convention
            playwright_cookie["sameSite"] = sameSite[0].upper() + sameSite[1:].lower()
    
    # Copy other relevant flags
    if "httpOnly" in cookie:
        playwright_cookie["httpOnly"] = cookie["httpOnly"]
    if "secure" in cookie:
        playwright_cookie["secure"] = cookie["secure"]
    
    playwright_cookies.append(playwright_cookie)

# Save the converted cookies to a file in Playwright format
with open("playwright_cookies.json", "w") as f:
    # Save the exact string needed for the navigation payload
    f.write('{"cookies": ')
    f.write(json.dumps(json.dumps(playwright_cookies)))
    f.write('}')

# Also save the raw cookies array for use in temp_cookies.json
with open("temp_cookies.json", "w") as f:
    json.dump(playwright_cookies, f, indent=2)

print("Cookie conversion complete. Check playwright_cookies.txt for the navigation payload format.") 
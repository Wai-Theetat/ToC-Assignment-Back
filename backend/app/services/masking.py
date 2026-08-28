import re

def mask_credit_card(credit_card : str) ->str: 
    
    #จาก assignment บัตรเครดิต จะมาในรูปแบบ (ตัวเลข 4 ตัว - ตัวเลข 4 ตัว - ตัวเลข 4 ตัว - ตัวเลข 4 ตัว)
    #ผลลัพธ์ที่ต้องการคือเซ็นเซอร์ตัวเลข 3 กลุ่มแรก เหลือไว้แค่ตัวเลขกลุ่มสุดท้าย

    #โดยฟังก์ชัน regex ที่ใช้คือ re.sub(pattern, replacement, string)
    #ใน pattern parameter เราจะได้ตัวเลข 4 กลุ่ม 
    #โดยใช้ regex (\d{4}) ซึ่งหมายถึง ตัวเลข 4 ตัว
    #ในส่วนของ replacement parameter
    #เราจะคืนค่ากับเป็น string 'XXXX-XXXX-XXXX-' แล้วต่อด้วยกลุ่มที่ 4
    #แล้วคืนค่า newFormat ให้กับ caller

    newFormat = re.sub(r'(\d{4})-(\d{4})-(\d{4})-(\d{4})', r'XXXX-XXXX-XXXX-\4', credit_card)
    return f"{newFormat}"

def mask_tel(tel : str) -> str:
    
    #จาก assignment เบอร์โทรศัพท์ จะมาในรูปแบบ (ตัวเลข 3 ตัว - ตัวเลข 3 ตัว - ตัวเลข 4 ตัว)
    #ผลลัพธ์ที่ต้องการคือเซ็นเซอร์ตัวเลข 2 กลุ่มแรก เหลือไว้แค่ตัวเลขกลุ่มสุดท้าย

    #โดยฟังก์ชัน regex ที่ใช้คือ re.sub(pattern, replacement, string)
    #ใน pattern parameter เราจะได้ตัวเลข 3 กลุ่ม 
    #โดยใช้ regex (\d{3}) ซึ่งหมายถึง ตัวเลข 3 ตัว
    #และ (\d{4}) ซึ่งหมายถึง ตัวเลข 4 ตัว

    #ในส่วนของ replacement parameter
    #เราจะคืนค่ากับเป็น string 'XXX-XXX-' แล้วต่อด้วยกลุ่มที่ 3
    #แล้วคืนค่า newFormat ให้กับ caller
    
    newFormat = re.sub(r'(\d{3})-(\d{3})-(\d{4})', r'XXX-XXX-\3', tel)
    return f"{newFormat}"

def mask_email(email : str) -> str:
    #จาก assignment จะมีอีเมลมาด้วย โดยมีรูปแบบคือจะขึ้นต้นด้วยคำอะไรก็ได้ขั้นด้วย @ แล้วตามด้วย domain name เช่น somchai.d@company.com
    #ผลลัพธ์ที่ต้องการคือ ตัวอักษรตัวแรก เซ็นเซอร์กลุ่มตัวอักษรตรงกลางทั้งหมด และจนถึงตัวอักษรก่อนตัวสุดท้ายก่อน @ 

    #โดยฟังก์ชัน regex ที่ใช้คือ re.sub(pattern, replacement, string)
    #ใน pattern parameter เราจะได้ตัวเลข 3 กลุ่ม 
    #โดยใช้ regex r'^(\w)(.*?)(\w)(?=@)'
    #โดยแต่ละตัวมีความหมายดังนี้
    #(\w) หมายถึง ตัวอักษรเพียงตัวเดียว
    #(.*?) หมายถึง ตัวอักษรตรงกลางทั้งหมด
    #(?=@) หมายถึง regex นี้จะหยุดตรงตัวอักษรที่ @

    #ในส่วนของ replacement parameter 
    #เราไม่สามารถสร้าง string ด้วยวิธีก่อนหน้าได้
    #จึงมีการสร้าง helper function ชื่อ mask email เพื่อช่วยในการสร้าง string
    
    def _replace(match):
        
        #จาก regex เราจะได้ตัวอักษร 3 กลุ่ม
        #โดยเราจะใช้ตัวอักษรกลุ่มแรก กลุ่มตัวอักษรตรงกลาง และตัวอักษรสุดท้ายก่อน @
        #ใน string ใหม่ เราจะคืนค่ากับตัวอักษรกลุ่มแรก + กลุ่มตัวอักษรตรงกลางที่ถูกเซ็นเซอร์ + ตัวอักษรกลุ่มสุดท้าย
        
        first = match.group(1)
        middle = match.group(2)
        last = match.group(3)
        return first + '*' * len(middle) + last

    #จากโค้ดอาจเกิดคำถามว่า แล้ว string หลัง @ ไปอยู่ไหน
    #ก็คือหลังจากใช้ regex จบแล้วส่วนที่ไม่โดน จะยังอยู่เหมือนเดิมไม่โดนแตะ และเมื่อ mask_email คืนค่า string ใหม่กลับมา 
    # re.sub() ก็จะเอาค่าที่ได้มารวมกับส่วนที่ไม่โดนแตะ
    newformat = re.sub(r'^(\w)(.*?)(\w)(?=@)', _replace, email)
    return newformat

def mask_dob(DOB: str) -> str:
    #จาก assignment วันเกิด จะมาในรูปแบบ : วัน(ตัวเลข)/เดือน(ตัวเลข)/ปี(ตัวเลข) เช่น 25/12/2549
    #ผลลัพธ์ที่ต้องการคือ XX/XX/(ตัวเลขสองตัวแรกของปีที่ไม่เซ็นเซอร์)XX 

    #โดยฟังก์ชัน regex ที่ใช้คือ re.sub(pattern, replacement, string)
    #ใน pattern parameter เราจะได้ตัวเลข 4 กลุ่ม 
    #โดยใช้ regex r'(\d{1,2})/(\d{1,2})/(\d{2})(\d+)'
    #โดยแต่ละตัวมีความหมายดังนี้
    #(\d{1,2}) หมายถึง ตัวเลข 1 หรือ 2 ตัว
    #(\d{2}) หมายถึง ตัวเลข 2 ตัว
    #(\d+) หมายถึง ตัวเลข 1 หรือมากกว่า

    #ในส่วนของ replacement parameter 
    #เราสามารถใช้ XX/XX/\3XX แบบปกติได้ 
    #แต่ในกรณีที่ input ของปีเกิดมีตัวเลขมากกว่า 4 ตัว เราจึงสร้าง helper function เพื่อช่วยในการสร้าง string ใหม่
    def _replace(match):
        #จาก regex เราจะได้ตัวเลข 4 กลุ่ม แต่จะโฟกัสในส่วนของปีเกิดอย่างเดียว
        
        third = match.group(3)
        fourth = match.group(4)
        #ในส่วนของ วัน และเดือน เราจะคืนค่าเป็น XX/XX/ 
        #และในส่วนของปี จาก assignment เราจะคไม่เซ็นเซอร์ตัวเลข 2 ตัวแรก และส่วนที่เหลือจะถูกเซ็นเซอร์ด้วย X
        return f"XX/XX/{third}{len(fourth) * 'X'}"
    
    newFormat = re.sub(r'(\d{1,2})/(\d{1,2})/(\d{2})(\d+)', _replace, DOB)
    #เพิ่ม string DOB: กลับเข้าไปเหมือนเดิม เนื่องจากตัดออกไปก่อนเข้าฟังก์ชัน
    return f"{newFormat}"

def mask_address(address: str) -> str:
    #จาก assignment address จะมาในรูปแบบ : Address: บ้านเลขที่ ซอย ถนน แขวง เขต จังหวัด และอื่นๆ
    #เช่น 689 ซอยลาดกระบัง 19 ถนนลาดกระบัง แขวงลาดกระบัง เขตลำดกระบัง กรุงเทพฯ"

    #สิ่งที่ต้องการคือเซ็นเซอร์บ้านเลขที่เท่านั้น ส่วนอื่นๆไม่ต้องเซ็นเซอร์
    #โดยฟังก์ชัน regex ที่ใช้คือ re.sub(pattern, replacement, string)
    #ใน pattern parameter เราจะได้ตัวเลข 4 กลุ่ม 
    #โดยใช้ regex r'\d+(?:/\d+)?' count=1
    #โดยมีความหมายคือ
    #\d+ หมายถึง ตัวเลข 1 หรือมากกว่า
    #(?:/\d+)? หมายถึง optional group ที่หมายถึง "อาจจะมี / ตามด้วยตัวเลขอีก 1 หรือมากกว่า เช้น 34/7"

    #จาก regex เราจะได้ตัวเลขบ้านเลขที่ แต่ตามตัวอย่างด้านบนที่อาจมีตัวอักษรที่ไม่ใช่ตัวเลขปะปนมาด้วย
    #เราจะใช้ helper function mask_digits เพื่อช่วยในการสร้าง string ใหม่
    def _replace(match):
        #ใช้ regex แบบ simple คือ re.sub(r'\d', 'X', match.group()) เพื่อเซ็นเซอร์ตัวเลขทั้งหมดในบ้านเลขที่
        return re.sub(r'\d', 'X', match.group())
    
    newformat = re.sub(r'\d+(?:/\d+)?', _replace, address, count=1)
    #เพิ่ม string Address: กลับเข้าไปเหมือนเดิม เนื่องจากตัดออกไปก่อนเข้าฟังก์ชัน
    return f"{newformat}"


def mask_text(text: str) -> str:
    """
    Auto-detect and mask sensitive patterns in free-form text using regex only.
    No labels or prefixes required — patterns are identified purely by their format.

    Order matters: credit card must come before phone (both use dashes + digits).
    """

    # 1. Credit card: 4-4-4-4 digit groups  →  XXXX-XXXX-XXXX-<last4>
    #    Must run BEFORE phone to avoid partial matches on the dashes.
    result = re.sub(
        r'\d{4}-\d{4}-\d{4}-(\d{4})',
        r'XXXX-XXXX-XXXX-\1',
        text
    )

    # 2. Phone: 3-3-4 digit groups  →  XXX-XXX-<last4>
    result = re.sub(
        r'\d{3}-\d{3}-(\d{4})',
        r'XXX-XXX-\1',
        result
    )

    # 3. Email: local@domain  →  first + stars + last @ domain
    #    Identified purely by @ and domain-like suffix.
    def _mask_email(match):
        local = match.group(1)
        domain = match.group(2)
        if len(local) <= 2:
            return match.group(0)
        return local[0] + '*' * (len(local) - 2) + local[-1] + '@' + domain

    result = re.sub(
        r'([\w.+-]+)@([\w.-]+\.[a-zA-Z]{2,})',
        _mask_email,
        result
    )

    # 4. Date of birth: d/d/dddd  →  XX/XX/<year_prefix>XX
    #    Identified by day/month/year format. Keeps first 2 digits of year.
    def _mask_dob(match):
        year_prefix = match.group(3)
        year_suffix = match.group(4)
        return f"XX/XX/{year_prefix}{'X' * len(year_suffix)}"

    result = re.sub(
        r'(\d{1,2})/(\d{1,2})/(\d{2})(\d+)',
        _mask_dob,
        result
    )

    # 5. Address house number — scan each number, look 150 chars ahead for address keywords.
    #    If keyword found → this is a house number → mask it, then skip 150 chars forward.
    #    The 150-char skip ensures soi/street numbers inside the same address are never checked.
    #    Works for whole-JSON input and multiple addresses. Handles X/Y format (e.g. 89/1).
    _ADDRESS_KEYWORDS = re.compile(
        r'ซอย|ถนน|แขวง|เขต|หมู่|ตำบล|อำเภอ|จังหวัด|หมู่บ้าน'
        r'|\b[Ss]treet\b|\b[Ss]t\b|\b[Aa]venue\b|\b[Aa]ve\b|\b[Rr]oad\b|\b[Rr]d\b'
        r'|\b[Ll]ane\b|\b[Ll]n\b|\b[Dd]rive\b|\b[Dd]r\b|\b[Bb]oulevard\b|\b[Bb]lvd\b'
        r'|\b[Ww]ay\b|\b[Cc]ourt\b|\b[Cc]t\b|\b[Pp]lace\b|\b[Pp]l\b|\b[Aa]lley\b'
    )

    parts = []
    pos = 0
    skip_until = 0

    for m in re.finditer(r'\d+(?:/\d+)?', result):
        start, end = m.start(), m.end()
        if start < skip_until:
            continue
        # Short lookahead (15 chars): house number is always directly before a keyword
        # with at most one space between them (e.g. "689 ซอย" = 4 chars away).
        # Long skip (150 chars): skip over soi/street numbers inside the same address.
        lookahead = result[end:end + 15]
        if _ADDRESS_KEYWORDS.search(lookahead):
            parts.append(result[pos:start])
            parts.append(re.sub(r'\d', 'X', m.group()))
            pos = end
            skip_until = end + 150

    parts.append(result[pos:])
    result = ''.join(parts)

    return result

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


def filter_input(input):
    credit_card = re.search(r'(\d{4})-(\d{4})-(\d{4})-(\d{4})', input).group()
    email = re.search(r'[\w\.-]+@[\w\.-]+', input).group()
    tel = re.search(r'(\d{3})-(\d{3})-(\d{4})', input).group()
    date_of_birth = re.search(r'DOB:(\d{1,2}/\d{1,2}/\d{4})', input).group(1)

    temp = input
    temp = temp.replace(f"DOB:{date_of_birth}", "")
    temp = temp.replace(credit_card, "")
    temp = temp.replace(email, "")
    temp = temp.replace(tel, "")
    address = re.search(r'Address: (.*)', temp).group(1)
    
    return credit_card, email, tel, date_of_birth, address
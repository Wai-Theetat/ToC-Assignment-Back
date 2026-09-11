import re

def main(text_log: str):
    if(text_log is None or text_log == ""):
        return "Error : Input is empty"
    return masked_text(text_log)

def masked_text(input):
    #find values
    credit_card, email, tel, date_of_birth, address = find_details(input)

    masked_tel = censor_tel(tel)
    masked_credit_card = censor_credit_card(credit_card)
    masked_email = censor_email(email)
    masked_dob = censor_DOB(date_of_birth)
    masked_address = censor_address(address)

    input_buffer = input

    if address: input_buffer = input_buffer.replace(f"Address: {address}", masked_address)
    if tel: input_buffer = input_buffer.replace(tel, masked_tel)
    if credit_card: input_buffer = input_buffer.replace(credit_card, masked_credit_card)
    if email: input_buffer = input_buffer.replace(email, masked_email)
    if date_of_birth: input_buffer = input_buffer.replace(f"DOB:{date_of_birth}", masked_dob)

    return input_buffer

def find_credit_card(input):
    try:
        return re.search(r'(\d{4})-(\d{4})-(\d{4})-(\d{4})', input).group()
    except:
        return ""

def find_email(input):
    try:
        return re.search(r'[\w\.-]+@[\w\.-]+', input).group()
    except:
        return ""

def find_tel(input):
    try:
        return re.search(r'(\d{3})-(\d{3})-(\d{4})', input).group()
    except:
        return ""

def find_DOB(input):
    try:
        return re.search(r'DOB:(\d{1,2}/\d{1,2}/\d{4,})', input).group(1)
    except:
        return ""

def find_details(input):
    temp = input

    credit_card = find_credit_card(input)
    email = find_email(input)
    tel = find_tel(input)
    date_of_birth = find_DOB(input)

    if date_of_birth: temp = temp.replace(f"DOB:{date_of_birth}", "")
    if credit_card: temp = temp.replace(credit_card, "")
    if email: temp = temp.replace(email, "")
    if tel: temp = temp.replace(tel, "")
    
    try:
        address = re.search(r'Address: (.*)', temp).group(1).strip()
        return credit_card, email, tel, date_of_birth, address
    except:
        return credit_card, email, tel, date_of_birth, ""

def censor_credit_card(credit_card):
    if credit_card is None:
        return ""
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

def censor_tel(tel):
    if tel is None:
        return ""
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

def censor_email(email):
    if email is None:
        return ""
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
    
    def mask_email(match):
        
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
    newformat = re.sub(r'^(\w)(.*?)(\w)(?=@)', mask_email, email)
    return newformat

def censor_DOB(DOB):
    if DOB is None:
        return ""
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
    def mask_DOB(match):
        #จาก regex เราจะได้ตัวเลข 4 กลุ่ม แต่จะโฟกัสในส่วนของปีเกิดอย่างเดียว
        
        third = match.group(3)
        fourth = match.group(4)
        #ในส่วนของ วัน และเดือน เราจะคืนค่าเป็น XX/XX/ 
        #และในส่วนของปี จาก assignment เราจะคไม่เซ็นเซอร์ตัวเลข 2 ตัวแรก และส่วนที่เหลือจะถูกเซ็นเซอร์ด้วย X
        return f"XX/XX/{third}{len(fourth) * 'X'}"
    
    newFormat = re.sub(r'(\d{1,2})/(\d{1,2})/(\d{2})(\d+)', mask_DOB, DOB)
    #เพิ่ม string DOB: กลับเข้าไปเหมือนเดิม เนื่องจากตัดออกไปก่อนเข้าฟังก์ชัน
    return f"DOB:{newFormat}"

def censor_address(address):
    if address is None:
        return ""
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
    def mask_digits(match):
        #ใช้ regex แบบ simple คือ re.sub(r'\d', 'X', match.group()) เพื่อเซ็นเซอร์ตัวเลขทั้งหมดในบ้านเลขที่
        return re.sub(r'\d', 'X', match.group())
    
    newformat = re.sub(r'\d+(?:/\d+)?', mask_digits, address, count=1)
    #เพิ่ม string Address: กลับเข้าไปเหมือนเดิม เนื่องจากตัดออกไปก่อนเข้าฟังก์ชัน
    return f"Address: {newformat}"


if __name__ == "__main__":
    text_log : str = "Address: 689 ซอยลาดกระบัง 19 ถนนลาดกระบัง แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพฯ 093-245-7894 1234-5678-9012-3456 somchai.d@company.com DOB:25/12/2549"
    result = main(text_log)
    print(result)